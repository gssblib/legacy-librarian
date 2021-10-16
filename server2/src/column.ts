import {SqlParamValue} from './sql';
import {capitalizeFirst} from './util';

export type QueryOp = 'contains'|'equals'|'startswith'|'endswith';

export enum DomainTypeEnum {
  STRING = 'string',
  ENUM = 'enum',
}

export type DomainType = DomainTypeEnum.ENUM|DomainTypeEnum.STRING;

/**
 * Properties of the value type of a column.
 */
export interface ColumnDomain<T> {
  type: DomainType;

  /** Conversion of a column value to a field value (default is identity). */
  fromDb?: (dbValue: SqlParamValue) => T | undefined;

  /** Conversion of a field value to a column value (default is identity). */
  toDb?: (value: T) => SqlParamValue;

  options?: string[];
}

class Domains {
  static STRING: ColumnDomain<string> = {
    type: DomainTypeEnum.STRING,
    fromDb: (dbValue: SqlParamValue) =>
        dbValue === null ? undefined : dbValue as string,
    toDb: (value: string) => value,
  }
}

/**
 * Config for a column of an entity table.
 */
export interface ColumnConfig<T, K extends keyof T> {
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
  if (config.domain) {
    config.domain = {...config.domain};
    delete config.domain.fromDb;
  }
  return config;
}
