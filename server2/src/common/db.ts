import mysql from 'mysql2/promise';
import {QueryOptions, QueryResult} from './query';
import {SqlParams, SqlQuery} from './sql';

/**
 * Excapes an identifier in a SQL string using backticks.
 */
export function escapeId(name: string): string {
  return '`' + name + '`';
}

/**
 * Options for a `Db`.
 */
interface DbOptions {
  /** Limit used in case of a query with offset but no limit. */
  defaultLimit: number;
}

const DEFAULT_OPTIONS: DbOptions = {
  defaultLimit: 100,
};

/**
 * Wrapper around a mysql2 connection pool.
 */
export class Db {
  constructor(
      readonly pool: mysql.Pool, private readonly options = DEFAULT_OPTIONS) {}

  /**
   * Runs a task with either the given connection or a connection from the pool.
   * 
   * @param connection Optional connection to run the task on
   * @param task Task to exectue
   * @returns Result of the task
   */
  async withConnection<T>(
      connection: mysql.Connection|undefined,
      task: (connection: mysql.Connection) => Promise<T>): Promise<T> {
    let poolConnection: mysql.PoolConnection|undefined = undefined;
    if (!connection) {
      poolConnection = await this.pool.getConnection();
      connection = poolConnection;
    }
    try {
      return await task(connection);
    } finally {
      if (poolConnection) {
        poolConnection.release();
      }
    }
  }

  /**
   * Executes a SQL (DML) statement.
   *
   * @param sql SQL statement
   * @param params Values to be inserted for the placeholder in the SQL string
   * @param connection Optional connection to use
   * @returns resulting rows
   */
  async execute(
      sql: string, params: SqlParams = [],
      connection?: mysql.Connection): Promise<mysql.ResultSetHeader|mysql.RowDataPacket[]> {
    console.log(`execute: sql=${sql} params=${params}`);
    return this.withConnection(connection, async (connection) => {
      const result = await connection.execute(sql, params);
      const rows = result[0] as mysql.RowDataPacket[];
      return rows;
    });
  }

  /**
   * Executes a SQL query.
   *
   * @param sql SQL select statement
   * @param params Values to be inserted for the placeholder in the SQL string
   * @param connection Optional connection to use
   * @returns fetched rows
   */
  async query(
      sql: string, params: SqlParams = [],
      connection?: mysql.Connection): Promise<mysql.RowDataPacket[]> {
    console.log(`query: sql=${sql} params=${params}`);
    return this.withConnection(connection, async (connection) => {
      const result = await connection.query(sql, params);
      const rows = result[0] as mysql.RowDataPacket[];
      return rows;
    })
  }

  /**
   * Selects a single row.
   *
   * @param sql SQL select statement
   * @param params Values to be inserted for the placeholder in the SQL string
   * @param connection Optional connection to use
   * @returns Selected row
   */
  async selectRow(
      sql: string, params?: SqlParams,
      connection?: mysql.Connection): Promise<mysql.RowDataPacket|undefined> {
    const rows = await this.query(sql, params, connection);
    if (rows.length > 1) {
      throw new Error(
          `expected at most 1 row, got ${rows.length}, sql: "${sql}""`);
    }
    return rows[0];
  }

  /**
   * Selects multiple rows.
   *
   * @param query Query with SQL string and options
   * @returns Selected rows
   */
  async selectRows(query: SqlQuery): Promise<QueryResult<mysql.RowDataPacket>> {
    let valueSql = query.sql;
    const valueParams: SqlParams = query.params ?? [];
    const options: QueryOptions = query.options ?? {};

    // Add order clause if needed.
    if (options.order) {
      const order: string = options.order;
      if (order[0] === '-') {
        valueSql += ` order by ${order.substring(1)} desc`;
      } else {
        valueSql += ` order by ${order}`;
      }
    }

    // Add limit clause if needed.
    if (options.offset) {
      valueSql += ' limit ?, ?';
            valueParams.push(options.offset, options.limit ?? this.options.defaultLimit);
    } else if (options.limit) {
      valueSql += ' limit ?';
      valueParams.push(options.limit);
    }

    if (options.returnCount) {
      // replace `from` clause (everything between `select` and `from`) with
      // `count(1)`
      const countSql = query.sql.replace(
          /(\s*select\s+).*?(\s+from.*)/i, '$1 count(1) as count $2');

      // run the count and value queries in parallel
      const [countResult, rows] = await Promise.all([
          this.selectRow(countSql, query.params ?? []),
          this.query(valueSql, valueParams),
      ]);
      return {count: countResult?.count, rows};
    } else {
      return {rows: await this.query(valueSql, valueParams)};
    }
  }
}