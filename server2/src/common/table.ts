import mysql from 'mysql2/promise';
import {Column, ColumnConfig, toFrontendColumnConfig} from './column';
import {Db} from './db';
import {EntityQuery, LogicalOp, mapQueryResult, QueryResult} from './query';
import {SqlParams, SqlParamValue, SqlQuery, SqlTerm, SqlWhere} from './sql';

/**
 * Configuration of an `Entity` that maps a database table to a TS type `T`.
 */
export interface EntityConfig<T> {
  /** Name of the entity. */
  name: string;

  /** Optional table name, defaults to the entity `name`. */
  tableName?: string;

  naturalKey?: string;
}

/**
 * Represents a database table mapped to a TS class.
 */
export class EntityTable<T> {
  readonly tableName: string;
  readonly columns: Column<T, keyof T, SqlParamValue>[] = [];
  readonly columnsByName = new Map<keyof T, Column<T, keyof T, SqlParamValue>>();

  constructor(readonly config: EntityConfig<T>) {
    this.tableName = config.tableName ?? config.name;
  }

  addColumn<K extends keyof T, C extends SqlParamValue>(columnConfig: ColumnConfig<T, K, C>) {
    const column: Column<T, K, C> = new Column(columnConfig);
    this.columns.push(column);
    this.columnsByName.set(column.name, column);
  }

  getColumn<K extends keyof T>(field: K): Column<T, K, SqlParamValue>|undefined {
    return this.columnsByName.get(field) as Column<T, K, SqlParamValue>|undefined ;
  }

  /**
   * Converts a row to an entity of type `T` using the column definitions.
   */
  fromDb(row: mysql.RowDataPacket): T {
    const obj: any = {};
    for (const column of this.columns) {
      const field = column.name as string;
      const columnValue = row[field];
      const fromDb = column.config?.domain?.fromDb;
      obj[field] = fromDb ? fromDb(columnValue) : columnValue;
    }
    return obj as T;
  }

  /**
   * Returns the metadata of the entity as used by the dynamic forms (using
   * the formly forms library) in the Angular UI.
   */
  getFields(): ColumnConfig<T, keyof T, SqlParamValue>[] {
    return this.columns
        .filter(column => !column.config.internal && column.name !== 'id')
        .map(column => toFrontendColumnConfig(column.config));
  }

  sqlTerm(field: keyof T, value: any): SqlTerm<T>|undefined {
    const column = this.columnsByName.get(field);
    if (!column) {
      return undefined;
    }
    const op = column?.queryOp ?? 'equals';
    switch (op) {
      case 'contains':
        return {field, op: 'like', value: `%${value}%`};
      case 'startswith':
        return {field, op: 'like', value: `${value}%`};
      case 'endswith':
        return {field, op: 'like', value: `%${value}`};
      default:
        return {field, op: '=', value};
    }
  }

  sqlTerms(fields: Partial<T>): Array<SqlTerm<T>> {
    const terms: Array<SqlTerm<T>> = [];
    for (const [name, value] of Object.entries(fields)) {
      const term = this.sqlTerm(name as keyof T, value);
      if (term) {
        terms.push(term);
      }
    }
    return terms;
  }

  sqlWhereFields(fields: Partial<T>, op: LogicalOp = 'and', prefix = ''):
      SqlWhere {
    const terms = this.sqlTerms(fields);
    let where = '';
    const params: SqlParams = [];
    if (terms.length > 0) {
      terms.forEach((term, index) => {
        if (index > 0) where += ` ${op} `;
        where += prefix + term.field + ' ' + term.op + ' ?';
        params.push(term.value);
      });
    }
    return {where, params};
  }

  /**
   * Returns the where clause and placeholder value for the `fields`.
   *
   * @param fields fields to filter by
   * @param prefix prefix to add to the field names
   */
  sqlWhere(query: EntityQuery<T>, prefix = ''): SqlWhere {
    const whereFields: SqlWhere = this.sqlWhereFields(query.fields ?? {}, query.op);
    const conditions: string[] = [];
    const params: SqlParams = [];
    if (whereFields.where.length > 0) {
      conditions.push(whereFields.where);
      params.push(...(whereFields.params ?? []));
    }
    if (query.sqlWhere?.where) {
      conditions.push(query.sqlWhere.where);
      params.push(...(query.sqlWhere?.params ?? []));
    }
    const where =
        conditions.length === 0 ? '' : `where ${conditions.join(' and ')}`;
    return {where, params};
  }

  /**
   * Converts the entity `query` to a `SqlQuery`.
   *
   * @param selector From clause, default is "* from ${tableName}".
   */
  toSqlQuery(query: EntityQuery<T>, selector?: string): SqlQuery {
    const from = selector ?? `* from ${this.tableName}`;
    if (query.fields) {
      const whereClause = this.sqlWhere(query);
      return {
        sql: `select ${from} ${whereClause.where}`,
        params: whereClause.params,
        options: query.options,
      };
    } else {
      return {
        sql: `select ${from}`,
        options: query.options,
      };
    }
  }

  /**
   * Selects the entities matching the query.
   */
  async list(db: Db, query: EntityQuery<T>): Promise<QueryResult<T>> {
    const sqlQuery = this.toSqlQuery(query);
    const result = await db.selectRows(sqlQuery);
    return mapQueryResult(result, row => this.fromDb(row));
  }

  /**
   * Selects a single entity matching the query.
   */
  async find(db: Db, query: EntityQuery<T>): Promise<T|undefined> {
    const sqlSelect = this.toSqlQuery(query);
    const row = await db.selectRow(sqlSelect.sql, sqlSelect.params);
    return row && this.fromDb(row);
  }

  /**
   * Inserts a new entity into the database.
   * 
   * Returns the stored entity (with the auto-generated id).
   */
  async create(db: Db, obj: T): Promise<T> {
    const columns: string[] = [];
    const placholders: string[] = [];
    const params: any[] = [];

    for (const column of this.columns) {
      const value = obj[column.name];
      if (value != undefined) {
        columns.push(column.name as string);
        placholders.push('?');
        const toDb = column.config.domain?.toDb;
        params.push(toDb ? toDb(value) : value);
      }
    }
    const sql = `
        insert into ${this.tableName} (${columns.join(', ')})
        values (${placholders.join(', ')})
      `;
    const result = await db.execute(sql, params) as mysql.ResultSetHeader;
    console.log('EntityTable.create', result);
    this.setId(obj, result.insertId);
    return obj;
  }

  /**
   * Applies a partial update to an existing object.
   * 
   * Only registered columns can be updated. The update is performed with a SQL
   * `update` statement setting the columns of the updated fields.
   */
  async update(db: Db, obj: Partial<T>): Promise<any> {
    const params: any[] = [];
    let sql = '';
    for (const column of this.columns) {
      const value = obj[column.name];
      if (value != undefined) {
        if (sql.length > 0) sql += ', ';
        sql += column.name + ' = ?';
        const toDb = column.config.domain?.toDb;
        params.push(toDb ? toDb(value) : value);
      }
    }
    sql = `update ${this.tableName} set ${sql} where id = ?`;
    params.push(this.getId(obj));
    const result = await db.execute(sql, params) as mysql.RowDataPacket[];
    return result;
  }

  async remove(db: Db, key: string|number): Promise<T> {
    const keyColumn = this.config.naturalKey ?? 'id';
    const sql = `delete from ${this.tableName} where ${keyColumn} = ?`;
    const rows = await db.execute(sql, [key]) as mysql.RowDataPacket[];
    console.log('EntityTable.remove', rows);
    const row = rows[0];
    return row && this.fromDb(row);
  }

  protected getId(obj: Partial<T>): number|undefined {
    return (obj as unknown as {id?: number}).id;
  }

  protected setId(obj: T, id: number): void {
    (obj as unknown as {id: number}).id = id;
  }
}