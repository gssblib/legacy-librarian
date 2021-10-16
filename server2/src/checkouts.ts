import {BaseEntity} from './base_entity';
import {ColumnConfig} from './column';
import {Db} from './db';
import {EntityConfig, EntityTable} from './table';

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

const checkoutColumns: Array<ColumnConfig<Checkout, keyof Checkout>> = [
  {name: 'id'},
  {name: 'barcode'},
  {name: 'borrowernumber'},
  {name: 'checkout_date'},
  {name: 'returndate'},
  {name: 'fine_due'},
  {name: 'fine_paid'},
];

class BaseCheckouts extends BaseEntity<Checkout> {
  constructor(db: Db, table: EntityTable<Checkout>) {
    super(db, table);
  }

  protected toKeyFields(key: string): Partial<Checkout> {
    return {id: parseInt(key, 10)};
  }
}

const checkoutsConfig: EntityConfig<Checkout> = {
  name: 'checkouts',
  tableName: '`out`',
  columns: checkoutColumns,
};

export const checkoutsTable = new EntityTable<Checkout>(checkoutsConfig);

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

export const historyTable = new EntityTable<Checkout>(historyConfig);

export class History extends BaseCheckouts {
  constructor(db: Db) {
    super(db, historyTable);
  }
}
