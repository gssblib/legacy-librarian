
/**
 * Generic query options.
 * 
 * These options are independent of the specific form of the query (SQL query or
 * filter).
 */
export interface QueryOptions {
  /** Zero-based offset to start the results from. */
  offset?: number;

  /** Maximum number of results to return. */
  limit?: number;

  /**
   * Name of the column/field to order by, preceded by '-' for descending
   * order.
   */
  order?: string;

  /**
   * If true, return the `count` in the `QueryResult`.
   *
   * This requires an additional query (which can be run in parallel to the main
   * query).
   */
  returnCount?: boolean;
}

/**
 * Result of a database query.
 */
export interface QueryResult<T> {
  /** Selected values (rows or converted rows). */
  rows: T[];

  /** Total number of result (in case of query with limit). */
  count?: number;
}

/**
 * Converts the value type of a `QueryResult`.
 */
export function mapQueryResult<S, T>(
    result: QueryResult<S>, f: (s: S) => T): QueryResult<T> {
  return {
    count: result.count,
    rows: result.rows.map(f),
  };
}

export type LogicalOp = 'and'|'or';

/**
 * A `FieldQuery` defines values for a subset of the fields of `T`.
 */
export interface EntityQuery<T> {
  /** Fields to match. */
  fields?: Partial<T>;

  /** Operator to use when combining the fields. */
  op?: LogicalOp;

  /** Options controlling which of the matching fields to return. */
  options?: QueryOptions;
}