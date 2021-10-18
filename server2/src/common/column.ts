import {SqlParamValue} from './sql';
import {capitalizeFirst} from './util';

export type QueryOp = 'contains'|'equals'|'startswith'|'endswith';

export enum DomainType {
  STRING = 'string',
  ENUM = 'enum',
}

export interface FrontendColumnDomain {
  readonly type: DomainType;
  readonly options?: string[];
}

/**
 * A `ColumnDomain` describes the mapping between the values in a column and
 * the values of the property of the entity (TS object) that the column is
 * mapped to.
 *
 * `V` is the type of the property mapped to the column and `C` the type of
 * the column (as used by mysql2).
 */
export interface ColumnDomain<V = string, C extends SqlParamValue = string> {
  readonly type: DomainType;

  /** Conversion of a column value to a field value (default is identity). */
  fromDb(dbValue: C|null): V | undefined;

  /** Conversion of a field value to a column value (default is identity). */
  toDb(value: V|undefined): C | null;

  readonly options?: string[];
}

/**
 * Most common domain for a string-to-string mapping.
 *
 * This domain maps `null` column values as used by mysql2 (for null columns) to
 * `undefined` property values.
 */
export class StringColumnDomain implements ColumnDomain<string, string> {
  fromDb(dbValue: string|null): string|undefined {
    return dbValue ?? undefined;
  }

  toDb(value: string|undefined): string|null {
    return value ?? null;
  }

  constructor(readonly type: DomainType = DomainType.STRING) {}
}

export class EnumColumnDomain extends StringColumnDomain {
  constructor(readonly options: string[]) {
    super(DomainType.ENUM);
  }
}

/**
 * Config for a column of an entity table.
 *
 * `T` is the type of the entity (the TS object), `K` the type of the key of the
 * property of `T` that is mapped to the column, and `C` the type of the column
 * (as used by mysql2).
 */
export interface ColumnConfig<T, K extends keyof T,
                                           C extends SqlParamValue = string> {
  /** Name of the column and field. */
  name: K;

  /** English label used for input fields. */
  label?: string;

  /** Default query operation for this column (default is `equals`). */
  queryOp?: QueryOp;

  /** Conversion of a query parameter to a field value. */
  fromParam?: (param: string) => T[K];

  domain?: ColumnDomain<T[K]>;

  /** If true, this column is required when creating the containing object. */
  required?: boolean;

  /** If true, this column is not shown in the UI. */
  internal?: boolean;
}

/**
 * Represents a column of the entity table.
 *
 * This class defines the defaults for the optional parts of the `ColumnConfig`.
 */
export class Column<T, K extends keyof T> {
  name: K = this.config.name;
  queryOp: QueryOp = this.config.queryOp ?? 'equals';
  label = this.config.label ?? capitalizeFirst(this.config.name as string);

  constructor(readonly config: ColumnConfig<T, K>) {}

  fromParam(param: string): T[K] {
    return this.config.fromParam ? this.config.fromParam(param) :
                                   param as unknown as T[K];
  }
}

export function toFrontendColumnConfig<T>(
    columnConfig: ColumnConfig<T, keyof T>): ColumnConfig<T, keyof T> {
  const config = {...columnConfig};
  delete config.fromParam;
  return config;
}
