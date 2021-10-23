import {SqlParamValue} from './sql';
import {capitalizeFirst, dateToIsoStringWithoutTimeZone} from './util';

export type QueryOp = 'contains'|'equals'|'startswith'|'endswith';

export enum DomainType {
  STRING = 'string',
  ENUM = 'enum',
  DATETIME = 'datetime',
  BOOLEAN = 'boolean',
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

  /** List of values of an enum domain. */
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

/**
 * Domain for date-time values.
 * 
 * The mysql column type is `datetime`, the field type `string|Date`.
 */
export class DateTimeColumnDomain implements ColumnDomain<Date|string, string> {
  fromDb(dbValue: string|null): Date|string|undefined {
    return dbValue ?? undefined;
  }

  toDb(value: Date|string|undefined): string|null {
    return value ? dateToIsoStringWithoutTimeZone(value) : null;
  }

  constructor(readonly type: DomainType = DomainType.DATETIME) {}
}

export const dateTimeColumnDomain: ColumnDomain<Date|string, string> = new DateTimeColumnDomain();

/**
 * Domain for boolean values.
 * 
 * The mysql column type is `tinyint`, the field type `boolean`.
 */
export class BooleanColumnDomain implements ColumnDomain<boolean, number> {
  fromDb(dbValue: number|null): boolean|undefined {
    return dbValue === null ? undefined : dbValue === 1;
  }

  toDb(value: boolean|undefined): number|null {
    return value === undefined ? null : value ? 1 : 0;
  }

  constructor(readonly type: DomainType = DomainType.BOOLEAN) {}
}

export const booleanColumnDomain: ColumnDomain<boolean, number> = new BooleanColumnDomain();


export class EnumColumnDomain<T extends string = string> implements ColumnDomain<T, string> {
  readonly type: DomainType = DomainType.ENUM;

  constructor(readonly options: string[]) {
  }

  fromDb(dbValue: string|null): T|undefined {
    return dbValue === null ? undefined : dbValue as T;
  }

  toDb(value: string|undefined): string|null {
    return value === undefined ? null : value;
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

  domain?: ColumnDomain<T[K], C>;

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
export class Column<T, K extends keyof T, C extends SqlParamValue = string> {
  name: K = this.config.name;

  /** Default query operation is 'equals'. */
  queryOp: QueryOp = this.config.queryOp ?? 'equals';

  /** Default label is the capitalized name. */
  label = this.config.label ?? capitalizeFirst(this.config.name as string);

  constructor(readonly config: ColumnConfig<T, K, C>) {}

  /**
   * The default parameter conversion casts the parameter to the field type.
   */
  fromParam(param: string): T[K] {
    return this.config.fromParam ? this.config.fromParam(param) :
                                   param as unknown as T[K];
  }
}

export function toFrontendColumnConfig<T>(
    columnConfig: ColumnConfig<T, keyof T, SqlParamValue>): ColumnConfig<T, keyof T, SqlParamValue> {
  const config = {...columnConfig};
  delete config.fromParam;
  return config;
}
