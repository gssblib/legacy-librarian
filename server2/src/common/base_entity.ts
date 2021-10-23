import mysql from 'mysql2/promise';
import qs from 'qs';
import {Db} from './db';
import {Entity, Flags} from './entity';
import {httpError} from './error';
import {ExpressApp, HttpMethod} from './express_app';
import {getBooleanParam, getNumberParam} from './express_util';
import {EntityQuery, QueryOptions, QueryResult} from './query';
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
  readonly apiPath = '/api';
  readonly name = this.table.config.name;
  readonly basePath = `${this.apiPath}/${this.name}`;
  readonly keyPath = `${this.basePath}/:key`;

  constructor(readonly db: Db, protected readonly table: EntityTable<T>) {}

  find(query: EntityQuery<T>): Promise<T|undefined> {
    return this.table.find(this.db, query);
  }

  async get(key: string, flags?: Flags<F>): Promise<T> {
    const object = await this.find(this.toKeyFields(key));
    if (!object) {
      throw httpError({
        code: 'ENTITY_NOT_FOUND',
        message: `${this.name} ${key} not found`,
        httpStatusCode: 404,
      });
    }
    return object;
  }

  list(query: EntityQuery<T>): Promise<QueryResult<T>> {
    return this.table.list(this.db, query);
  }

  create(obj: T): Promise<T> {
    return this.table.create(this.db, obj);
  }

  update(obj: Partial<T>): Promise<T|undefined> {
    return this.table.update(this.db, obj);
  }

  remove(key: string): Promise<T> {
    return this.table.remove(this.db, key);
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
  toQueryOptions(params: qs.ParsedQs): QueryOptions {
    return {
      offset: getNumberParam(params, 'offset'),
      limit: getNumberParam(params, 'limit'),
      order: params['_order'] as string | undefined,
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

  /**
   * Adds the routes for the REST API for this entity to the express
   * `Application`.
   */
  initRoutes(application: ExpressApp): void {
    // GET the fields metadata for the entity.
    application.addHandler({
      method: HttpMethod.GET,
      path: `${this.basePath}/fields`,
      handle: (req, res) => {
        res.send(this.table.getFields());
      },
    });

    // GET a single entity object.
    application.addHandler({
      method: HttpMethod.GET,
      path: this.keyPath,
      handle: async (req, res) => {
        const key = req.params['key'] ?? '';
        const result =
            await this.get(key, toFlags(req.query['options'] as string));
        res.send(result);
      },
      authAction: {resource: this.name, operation: 'read'}
    });

    // GET the collection of entities matching the query.
    application.addHandler({
      method: HttpMethod.GET,
      path: this.basePath,
      handle: async (req, res) => {
        const result = await this.list(this.toEntityQuery(req.query));
        res.send(result);
      },
      authAction: {resource: this.name, operation: 'read'}
    });

    // POST a new entity.
    application.addHandler({
      method: HttpMethod.POST,
      path: this.basePath,
      handle: async (req, res) => {
        const result = await this.create(req.body);
        res.send(result);
      },
      authAction: {resource: this.name, operation: 'create'}
    });

    // PUT partial updates (should be PATCH).
    application.addHandler({
      method: HttpMethod.PUT,
      path: this.basePath,
      handle: async (req, res) => {
        const result = await this.update(req.body);
        res.send(result);
      },
      authAction: {resource: this.name, operation: 'update'}
    });

    // DELETE an entity.
    application.addHandler({
      method: HttpMethod.DELETE,
      path: this.keyPath,
      handle: async (req, res) => {
        const key = req.params['key'] ?? '';
        const result = await this.remove(key);
        res.send(result);
      },
      authAction: {resource: this.name, operation: 'delete'}
    });
  }
}

function toFlags<F extends string>(param?: string): Flags<F> {
  if (!param) {
    return {};
  }
  const options = param.split(',') as F[];
  const flags: Flags<F> = {};
  for (const flag of options) {
    flags[flag] = true;
  }
  return flags;
}