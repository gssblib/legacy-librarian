import mysql from 'mysql2/promise';
import {BaseEntity} from '../common/base_entity';
import {ColumnConfig} from '../common/column';
import {Db} from '../common/db';
import {ExpressApp, HttpMethod} from '../common/express_app';
import {EntityQuery, mapQueryResult, QueryOptions, QueryResult} from '../common/query';
import {EntityConfig, EntityTable} from '../common/table';
import {addDays} from '../common/util';
import {Item, itemsTable} from './items';

export interface CheckoutConfig {
  /** Initial borrowing period in days: dueDate = checkoutDate + borrowDays. */
  readonly borrowDays: number;

  /**
   * Number of days added when renewing an item: dueDate = now + renewalDays.
   */
  readonly renewalDays: number;

  /**
   * Period when an item can be renewed.
   *
   *   checkoutDay > now - renewalLimitDays <=> renewal allowed
   */
  readonly renewalLimitDays: number;
}

export const checkoutConfig: CheckoutConfig = {
  borrowDays: 28,
  renewalDays: 28,
  renewalLimitDays: 15,
}

export interface Checkout {
  id?: number;
  barcode: string;
  borrowernumber: number;
  checkout_date: Date|string;
  date_due: Date|string;
  returndate?: Date|string;
  fine_due: number;
  fine_paid: number;
  renewable?: boolean;
}

/**
 * Sets the renewable flag in the 'checkout'.
 */
function setRenewable(checkout: Checkout) {
  const now = new Date();
  const checkoutLimit = addDays(now, -checkoutConfig.renewalLimitDays);
  checkout.renewable = checkout.checkout_date > checkoutLimit;
  return checkout;
}

export interface CheckoutItem extends Checkout, Item {}

const checkoutColumns: Array<ColumnConfig<Checkout, keyof Checkout>> = [
  {name: 'id'},
  {name: 'barcode'},
  {name: 'borrowernumber'},
  {name: 'checkout_date'},
  {name: 'date_due'},
  {name: 'returndate'},
  {name: 'fine_due'},
  {name: 'fine_paid'},
];

/**
 * Checkout-specific query that simplifies the selection of `Checkouts` for
 * borrowers.
 */
interface CheckoutQuery {
  /** If set, restrict the `Checkouts` to this borrower. */
  borrowernumber?: number;

  /** If true, only select `Checkouts` with a positive outstanding fee. */
  feesOnly?: boolean;

  /** Options controlling which of the selection objects to return. */
  options?: QueryOptions;
}

/**
 * Extended `EntityTable` for the `Checkout` tables (`out` and `issue_history`).
 */
class CheckoutTable extends EntityTable<Checkout> {
  constructor(config: EntityConfig<Checkout>) {
    super(config);
    this.addColumn({name: 'id'});
    this.addColumn({name: 'barcode'});
    this.addColumn({name: 'borrowernumber'});
    this.addColumn({name: 'checkout_date'});
    this.addColumn({name: 'date_due'});
    this.addColumn({name: 'returndate'});
    this.addColumn({name: 'fine_due'});
    this.addColumn({name: 'fine_paid'});
  }

  override fromDb(row: mysql.RowDataPacket): Checkout {
    const checkout = super.fromDb(row);
    setRenewable(checkout);
    return checkout;
  }

  /**
   * Converts a joined `Item` and `Checkout` row to a `CheckoutItem`.
   */
  toCheckoutItem(row: any): CheckoutItem {
    const item = itemsTable.fromDb(row);
    const checkout = this.fromDb(row);
    return {...item, ...checkout};
  }

  /**
   * Returns the `CheckoutItems` matching the `query`.
   *
   * The `Checkouts` are fetched from the `tableName` (`out` or
   * `issue_history`). They are joined with the `Items`.
   *
   * @param query Conditions on the selected `Checkouts`
   */
  async listCheckoutItems(db: Db, query: EntityQuery<Checkout>):
      Promise<QueryResult<CheckoutItem>> {
    const from = `
        a.*, b.* from items a left join ${this.tableName} b
        on a.barcode = b.barcode
      `;
    const sqlQuery = this.toSqlQuery(query, from);
    const result = await db.selectRows(sqlQuery);
    return mapQueryResult(result, row => this.toCheckoutItem(row));
  }

  /**
   * Returns `CheckoutItems` for a borrower.
   */
  async listBorrowerCheckoutItems(db: Db, query: CheckoutQuery):
      Promise<QueryResult<CheckoutItem>> {
    const entityQuery: EntityQuery<Checkout> = {
      options: query.options,
    };
    if (query.borrowernumber) {
      entityQuery.fields = {borrowernumber: query.borrowernumber};
    }
    if (query.feesOnly) {
      entityQuery.sqlWhere = {where: 'fine_due > fine_paid'};
    }
    return this.listCheckoutItems(db, entityQuery);
  }
}

const FLAT_LATE_FEE = 0.5;

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

  async payFee(id: number): Promise<any> {
    return await this.db.query(
        `update ${
            this.table.tableName} set fine_paid = fine_due where id = ?`,
        [id]);
  }

  override initRoutes(application: ExpressApp): void {
    application.addHandler({
      method: HttpMethod.POST,
      path: `${this.basePath}/:id/payFee`,
      handle: async (req, res) => {
        const result = await this.payFee(parseInt(req.params['id']));
        res.send(result);
      },
      authAction: {resource: 'fees', operation: 'update'},
    });
    super.initRoutes(application);
  }
}

export const checkoutsTable = new CheckoutTable({
  name: 'checkouts',
  tableName: '`out`',
});

export class Checkouts extends BaseCheckouts {
  constructor(db: Db) {
    super(db, checkoutsTable);
  }

  async updateFees(date: Date|string): Promise<any> {
    const result = await this.db.execute(
        `update ${this.table.tableName} set fine_due = if(date_due < ?, ${
            FLAT_LATE_FEE}, 0)`,
        [date]);
    return result;
  }

  override initRoutes(application: ExpressApp): void {
    application.addHandler({
      method: HttpMethod.POST,
      path: `${this.basePath}/updateFees`,
      handle: async (req, res) => {
        const date = req.body.date;
        const result = await this.updateFees(date);
        res.send(result);
      },
      authAction: {resource: 'fees', operation: 'update'},
    });
    super.initRoutes(application);
  }
}

export const historyTable = new CheckoutTable({
  name: 'history',
  tableName: 'issue_history',
});

export class History extends BaseCheckouts {
  constructor(db: Db) {
    super(db, historyTable);
  }
}
