import {QueryOptions} from './query';

export type SqlParamValue = string|number|null;
export type SqlParams = SqlParamValue[];


export interface SqlSelect {
  /** SQL select query string (possibly with ? placeholders). */
  sql: string;
  /** Values to insert into the placeholders. */
  params?: SqlParams;
}

export interface SqlWhere {
  /** SQL where clause string (possibly with ? placeholders). */
  where: string;
  /** Values to insert into the placeholders. */
  params?: SqlParams;
}

/**
 * SQL query with parameters and options.
 */
export interface SqlQuery extends SqlSelect {
  /** Options controlling which of the matching rows to return. */
  options?: QueryOptions;
}

export type SqlComparison = 'like'|'='|'>'|'<'|'>='|'<=';

/**
 * Term in a SQL where clause.
 */
export interface SqlTerm<T> {
  /** Name of the field (column) to compare. */
  field: keyof T;
  /** SQL Comparison operator. */
  op: SqlComparison;
  /** Value to compare the field to. */
  value: SqlParamValue;
}
