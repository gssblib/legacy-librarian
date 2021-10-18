import {BaseEntity} from '../common/base_entity';
import {ColumnConfig} from '../common/column';
import {Db} from '../common/db';
import {ExpressApp, HttpMethod} from '../common/express_app';
import {EntityQuery, mapQueryResult, QueryOptions, QueryResult} from '../common/query';
import {EntityConfig, EntityTable} from '../common/table';
import {Item, itemsTable} from './items';

export interface Checkout {
  id?: number;
  barcode: string;
  borrowernumber: number;
  checkout_date: Date|string;
  date_due: Date|string;
  returndate?: Date|string;
  fine_due: number;
  fine_paid: number;
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
  }

  /**
   * Converts a joined `Item` and `Checkout` row to a `CheckoutItem`.
   */
  private toCheckoutItem(row: any): CheckoutItem {
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
        a.*, b.* from items a inner join ${this.tableName} b
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
    });
    super.initRoutes(application);
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
