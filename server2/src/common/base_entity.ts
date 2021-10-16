import * as express from 'express';
import qs from 'qs';
import {Db} from './db';
import {Entity, Flags} from './entity';
import {getBooleanParam, getNumberParam} from './express_util';
import {EntityQuery, LogicalOp, QueryOptions, QueryResult} from './query';
import {EntityTable} from './table';

/**
 * Base class for `Entity` implementations.
 *
 * This base class implements all `Entity` methods (CRUD), delegating most
 * of the work dealing with SQL and the columns to the `EntityTable`.
 *
 * Derived class often implement additional methods or override the CRUD
 * methods, for example, using joins to fetch more data for the read methods.
 */
export abstract class BaseEntity<T, F extends string = ''> implements
    Entity<T, F> {
  constructor(readonly db: Db, protected readonly table: EntityTable<T>) {}

  async find(fields: Partial<T>, op: LogicalOp = 'and'): Promise<T|undefined> {
    return await this.table.find(this.db, fields, op);
  }

  async get(key: string, flags?: Flags<F>): Promise<T|undefined> {
    return this.find(this.toKeyFields(key));
  }

  async list(query: EntityQuery<T>): Promise<QueryResult<T>> {
    return await this.table.list(this.db, query);
  }

  async create(obj: T): Promise<T> {
    const columns: string[] = [];
    const placholders: string[] = [];
    const params: any[] = [];

    for (const column of this.table.columns) {
      const value = obj[column.name];
      if (value != undefined) {
        columns.push(column.name as string);
        placholders.push('?');
        params.push(value);
      }
    }
    const sql = `insert into ${this.table.tableName} (${columns.join(', ')}) ` +
        `values (${placholders.join(', ')})`;
    const rows = await this.db.execute(sql, params);
    this.setId(obj, rows[0].insertId);
    return obj;
  }

  async update(obj: Partial<T>): Promise<T|undefined> {
    const params: any[] = [];
    let sql = '';
    for (const column of this.table.columns) {
      const value = obj[column.name];
      if (value != undefined) {
        if (sql.length > 0) sql += ', ';
        sql += column.name + ' = ?';
        params.push(value);
      }
    }
    sql = `update ${this.table.tableName} set ${sql} where id = ?`;
    params.push(this.getId(obj));
    const rows = await this.db.execute(sql, params);
    const row = rows[0];
    return row && this.table.fromDb(row);
  }

  async remove(key: string): Promise<T> {
    const keyColumn = this.table.config.naturalKey ?? 'id';
    const sql = `delete from ${this.table.tableName} where ${keyColumn} = ?`;
    const rows = await this.db.execute(sql, [key]);
    const row = rows[0];
    return row && this.table.fromDb(row);
  }

  private toFields(params: qs.ParsedQs): Partial<T> {
    const fields: Partial<T> = {};
    for (const [name, paramValue] of Object.entries(params)) {
      const field = name as keyof T;
      const column = this.table.getColumn(field);
      if (column) {
        fields[field] = column.fromParam(paramValue as string);
      }
    }
    return fields;
  }

  /**
   * Converts express query parameters to `QueryOptions`.
   *
   * This takes care of the generic query option parameters `offset`, `limit`,
   * and `returnCount`.
   */
  private toQueryOptions(params: qs.ParsedQs): QueryOptions {
    return {
      offset: getNumberParam(params, 'offset'),
      limit: getNumberParam(params, 'limit'),
      returnCount: getBooleanParam(params, 'returnCount'),
    };
  }

  /**
   * Converts express query parameters to a `EntityQuery`.
   *
   * This includes the query options as well as the fields used to filter the
   * objects.
   */
  private toEntityQuery(params: qs.ParsedQs): EntityQuery<T> {
    const fields = this.toFields(params);
    const op = params['op'] === 'or' ? 'or' : undefined;
    const options = this.toQueryOptions(params);
    return {fields, op, options};
  }

  protected abstract toKeyFields(key: string): Partial<T>;

  protected getId(obj: Partial<T>): number|undefined {
    return (obj as unknown as {id?: number}).id;
  }

  protected setId(obj: T, id: number): void {
    (obj as unknown as {id: number}).id = id;
  }

  protected toFlags(options: F[]): Flags<F> {
    const flags: Flags<F> = {};
    for (const flag of options) {
      flags[flag] = true;
    }
    return flags;
  }

  /**
   * Adds the routes for the REST API for this entity to the express
   * `Application`.
   */
  initRoutes(app: express.Application): void {
    const basePath = `/api/${this.table.config.name}`;
    const keyPath = `${basePath}/:key`;
    app.get(`${basePath}/fields`, (req, res) => {
      res.send(this.table.getFields());
    });
    app.get(keyPath, async (req, res) => {
      const key = req.params['key'] ?? '';
      const options = (req.query['options'] as string ?? '').split(',') as F[];
      const result = await this.get(key, this.toFlags(options));
      res.send(result);
    });
    app.get(basePath, async (req, res) => {
      const result = await this.list(this.toEntityQuery(req.query));
      res.send(result);
    });
    app.post(basePath, async (req, res) => {
      const result = await this.create(req.body);
      res.send(result);
    });
    app.put(basePath, async (req, res) => {
      const result = await this.update(req.body);
      res.send(result);
    });
    app.delete(keyPath, async (req, res) => {
      const key = req.params['key'] ?? '';
      const result = await this.remove(key);
      res.send(result);
    });
  }
}