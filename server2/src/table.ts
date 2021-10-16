import {Column, ColumnConfig, toFrontendColumnConfig} from './column';
import { Db } from './db';
import {EntityQuery, LogicalOp, mapQueryResult, QueryResult} from './query';
import {SqlParams, SqlQuery, SqlSelect, SqlTerm, WhereClause} from './sql';

/**
 * Configuration of an `Entity` that maps a database table to a TS type `T`.
 */
export interface EntityConfig<T> {
  /** Name of the entity. */
  name: string;

  /** Optional table name, defaults to the entity `name`. */
  tableName?: string;

  naturalKey?: string;

  /** Mapped columns. */
  columns: ColumnConfig<T, keyof T>[];
}

/**
 * Represents a database table mapped to a TS class.
 */
export class EntityTable<T> {
  readonly tableName: string;
  readonly columns: Column<T, keyof T>[];
  readonly columnsByName: Map<keyof T, Column<T, keyof T>>;

  constructor(readonly config: EntityConfig<T>) {
    this.tableName = config.tableName ?? config.name;
    this.columns = config.columns.map(columnConfig => new Column(columnConfig));
    this.columnsByName = new Map<keyof T, Column<T, keyof T>>(
        this.columns.map(col => [col.name, col]));
  }

  getColumn(field: keyof T): Column<T, typeof field>|undefined {
    return this.columnsByName.get(field);
  }

  fromDb(row: any): T {
    const obj = {...row};
    for (const key in Object.keys(row)) {
      const field = key as keyof T;
      const column = this.getColumn(field);
      if (column?.config?.domain?.fromDb) {
        obj[field] = column.config.domain.fromDb(obj[field]);
      }
    }
    return obj as T;
  }

  getFields(): ColumnConfig<T, keyof T>[] {
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

  /**
   * Returns the where clause and placeholder value for the `fields`.
   *
   * @param fields fields to filter by
   * @param prefix prefix to add to the field names
   */
  sqlWhere(fields: Partial<T>, op: LogicalOp = 'and', prefix = ''):
      WhereClause {
    const terms = this.sqlTerms(fields);
    let where = '';
    const params: SqlParams = [];
    if (terms.length > 0) {
      where += 'where ';
      terms.forEach((term, index) => {
        if (index > 0) where += ` ${op} `;
        where += prefix + term.field + ' ' + term.op + ' ?';
        params.push(term.value);
      });
    }
    return {where, params};
  }

  sqlSelect(fields: Partial<T>, op: LogicalOp = 'and'): SqlSelect {
    const whereClause = this.sqlWhere(fields, op);
    const sql = `select * from ${this.tableName} ${whereClause.where}`;
    return {
      sql,
      params: whereClause.params,
    };
  }

  /**
   * Converts the entity `query` to a `SqlQuery`.
   */
  toSqlQuery(query: EntityQuery<T>): SqlQuery {
    if (query.fields) {
      const whereClause = this.sqlWhere(query.fields, query.op);
      return {
        sql: `select * from ${this.tableName} ${whereClause.where}`,
        params: whereClause.params,
        options: query.options,
      };
    } else {
      return {
        sql: `select * from ${this.tableName}`,
        options: query.options,
      };
    }
  }

  async list(db: Db, query: EntityQuery<T>): Promise<QueryResult<T>> {
    const sqlQuery = this.toSqlQuery(query);
    const result = await db.selectRows(sqlQuery);
    return mapQueryResult(result, row => this.fromDb(row));
  }

  async find(db: Db, fields: Partial<T>, op: LogicalOp = 'and'): Promise<T|undefined> {
    const sqlSelect = this.sqlSelect(fields, op);
    const row = await db.selectRow(sqlSelect.sql, sqlSelect.params);
    return row && this.fromDb(row);
  }
}