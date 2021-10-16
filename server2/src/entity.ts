import * as express from 'express';
import {EntityQuery, LogicalOp, QueryResult} from './query';

export type Flags<F extends string> = Partial<{[flag in F]: boolean}>;

/**
 * Interface modeling an entity mapped to a database table.
 *
 * An `Entity` instance represents the table (not a row).
 */
export interface Entity<T, F extends string = ''> {
  /**
   * Fetches the object matching the `fields`.
   */
  find(fields: Partial<T>, op: LogicalOp): Promise<T|undefined>;

  /**
   * Gets an object by natural key.
   *
   * @param flags Flags controlling which data is returned
   */
  get(key: string, flags?: Flags<F>): Promise<T|undefined>;

  /**
   * Fetches the objects matching the `query`.
   */
  list(query: EntityQuery<T>): Promise<QueryResult<T>>;

  /**
   * Inserts a new object into the database.
   *
   * @param obj Object to insert
   * @returns Inserted object with the auto-generated id
   */
  create(obj: T): Promise<T>;

  /**
   * Updates and existing object.
   *
   * @param obj Object to update, must have its id set
   * @returns updated object
   */
  update(obj: Partial<T>): Promise<T|undefined>;

  /**
   * Removes an object with the given natural key.
   */
  remove(key: string): Promise<T>;

  /**
   * Adds the routes for the REST API for this entity to the express
   * `Application`.
   */
  initRoutes(app: express.Application): void;
}