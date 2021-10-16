import { QueryOptions } from 'mysql2';
import {BaseEntity} from '../common/base_entity';
import {ColumnConfig} from '../common/column';
import {Db} from '../common/db';
import {EntityQuery, mapQueryResult, QueryResult} from '../common/query';
import {EntityConfig, EntityTable} from '../common/table';
import {Item, itemsTable} from './items';

export interface Checkout {
  id: number;
  barcode: string;
  borrowernumber: number;
  checkout_date: string;
  date_due: string;
  returndate: string;
  fine_due: number;
  fine_paid: number;
}

export interface CheckoutItem extends Checkout, Item {}

const checkoutColumns: Array<ColumnConfig<Checkout, keyof Checkout>> = [
  {name: 'id'},
  {name: 'barcode'},
  {name: 'borrowernumber'},
  {name: 'checkout_date'},
  {name: 'returndate'},
  {name: 'fine_due'},
  {name: 'fine_paid'},
];

class CheckoutTable extends EntityTable<Checkout> {
  constructor(config: EntityConfig<Checkout>) {
    super(config);
  }

  toCheckoutItem(row: any): CheckoutItem {
    const item = itemsTable.fromDb(row);
    const checkout = this.fromDb(row);
    return {...item, ...checkout};
  }

  async listCheckoutItems(db: Db, query: EntityQuery<Checkout>):
      Promise<QueryResult<CheckoutItem>> {
    const from = `
        a.*, b.* from items a inner join ${this.tableName} b
        on a.barcode = b.barcode
      `;
    const sqlQuery = this.toSqlQuery(query, from);
    const result = await db.selectRows(sqlQuery);
    return mapQueryResult(result, row => this.toCheckoutItem(row));
  }
}

class BaseCheckouts extends BaseEntity<Checkout> {
  constructor(db: Db, private readonly checkoutTable: CheckoutTable) {
    super(db, checkoutTable);
  }

  protected toKeyFields(key: string): Partial<Checkout> {
    return {id: parseInt(key, 10)};
  }

  async listCheckoutItems(query: EntityQuery<Checkout>):
      Promise<QueryResult<CheckoutItem>> {
    return this.checkoutTable.listCheckoutItems(this.db, query);
  }
}

const checkoutsConfig: EntityConfig<Checkout> = {
  name: 'checkouts',
  tableName: '`out`',
  columns: checkoutColumns,
};

export const checkoutsTable = new CheckoutTable(checkoutsConfig);

export class Checkouts extends BaseCheckouts {
  constructor(db: Db) {
    super(db, checkoutsTable);
  }
}

const historyConfig: EntityConfig<Checkout> = {
  name: 'history',
  tableName: 'issue_history',
  columns: checkoutColumns,
};

export const historyTable = new CheckoutTable(historyConfig);

export class History extends BaseCheckouts {
  constructor(db: Db) {
    super(db, historyTable);
  }
}
