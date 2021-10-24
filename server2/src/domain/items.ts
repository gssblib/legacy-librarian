import mysql from 'mysql2/promise';
import {BaseEntity} from '../common/base_entity';
import {booleanColumnDomain, EnumColumnDomain} from '../common/column';
import {Db} from '../common/db';
import {Flags} from '../common/entity';
import {httpError} from '../common/error';
import {ExpressApp, HttpMethod} from '../common/express_app';
import {EntityQuery, mapQueryResult, QueryResult} from '../common/query';
import {SqlQuery} from '../common/sql';
import {EntityTable} from '../common/table';
import {addDays} from '../common/util';
import {Borrower, borrowersTable} from './borrowers';
import {Checkout, checkoutConfig, checkoutsTable, historyTable} from './checkouts';
import {Order, OrderCycle, orderCyclesTable, OrderItem, orderItemsTable, ordersTable} from './orders';


const ItemState = new EnumColumnDomain([
  'CIRCULATING',
  'STORED',
  'DELETED',
  'LOST',
  'IN_REPAIR',
]);

const ItemDescription = new EnumColumnDomain([
  'Buch',
  'CD',
  'DVD',
  'Comic',
  'Multimedia',
  'Zeitschrift',
]);

const ItemSubject = new EnumColumnDomain([
  'Bilderbuch B - gelb',
  'CD',
  'Comic C - orange',
  'DVD',
  'Erzaehlung E - dunkelgruen',
  'Fasching',
  'Halloween',
  'Klassik',
  'Leseleiter LL - klar',
  'Maerchen Mae - rot',
  'Multimedia MM - rosa',
  'Musik',
  'Ostern',
  'Sachkunde S - blau',
  'Sachkunde Serie - hellblau',
  'St. Martin',
  'Teen T - hellgruen',
  'Uebergroesse - lila',
  'Weihnachten',
  'Zeitschrift',
]);

const ItemAge = new EnumColumnDomain([
  'All Ages',
  'K-1',
  'K-2',
  'T-12',
  'T-17',
  'Leseleiter-1A',
  'Leseleiter-1B',
  'Leseleiter-1C',
  'Leseleiter-2',
  'Leseleiter-3',
  'Leseleiter-4',
  'Leseleiter-5',
  'Leseleiter-6',
  'Leseleiter-7',
  'Leseleiter-8',
  'Leseleiter-9',
  'Leseleiter-10',
]);

type ItemAvailability = 'CHECKED_OUT'|'ORDERED'|'AVAILABLE';

export interface Item {
  id?: number;
  barcode: string;
  category: string;
  title: string;
  author: string;
  subject: string;
  publicationyear: number;
  publisher: string;
  age: string;
  serial: string;
  seriestitle: string;
  classification: string;
  itemnotes: string;
  replacementprice: number;
  state: string;
  isbn10: string;
  isbn13: string;
  antolin: boolean;
  has_cover_image: boolean;
  added: string;
  availability?: ItemAvailability;

  /** Current check-out of this item (if any). */
  checkout?: Checkout;

  /** Current order of this item (if any). */
  order_item?: OrderItem;

  /** Borrower who checked out or ordered this item. */
  borrower?: Borrower;

  /** History of check-outs. */
  history?: Checkout[];

  last_checkout_date?: Date|string;
}

function getItemAvailability(item: Item): ItemAvailability {
  if (item.checkout) {
    return 'CHECKED_OUT';
  } else if (item.order_item) {
    return 'ORDERED';
  } else {
    return 'AVAILABLE';
  }
}

export class ItemTable extends EntityTable<Item> {
  constructor() {
    super({name: 'items'});
    this.addColumn({name: 'id'});
    this.addColumn({name: 'barcode', required: true});
    this.addColumn({name: 'category', required: true, domain: ItemDescription});
    this.addColumn({name: 'title', required: true, queryOp: 'contains'});
    this.addColumn({name: 'author', queryOp: 'contains'});
    this.addColumn({name: 'subject', required: true, domain: ItemSubject});
    this.addColumn({name: 'publicationyear', label: 'Publication year'});
    this.addColumn({name: 'publisher'});
    this.addColumn({name: 'age', label: 'Reading age', domain: ItemAge});
    this.addColumn({name: 'serial', label: 'Number in series'});
    this.addColumn({name: 'seriestitle', label: 'Series title'});
    this.addColumn({name: 'classification'});
    this.addColumn({name: 'itemnotes', label: 'Notes'});
    this.addColumn({name: 'replacementprice', label: 'Replacment price'});
    this.addColumn({name: 'state', required: true, domain: ItemState});
    this.addColumn({name: 'isbn10', label: 'ISBN-10'});
    this.addColumn({name: 'isbn13', label: 'ISBN-13'});
    this.addColumn({name: 'antolin', label: 'Antolin book ID'});
    this.addColumn({name: 'has_cover_image', domain: booleanColumnDomain});
  }

  override fromDb(row: mysql.RowDataPacket): Item {
    const item = super.fromDb(row);
    item.availability = getItemAvailability(item);
    return item;
  }
}

export const itemsTable = new ItemTable();

type ItemFlag = 'history';
type ItemFlags = Flags<ItemFlag>;

export class Items extends BaseEntity<Item, ItemFlag> {
  constructor(db: Db) {
    super(db, itemsTable);
  }

  protected toKeyFields(key: string): Partial<Item> {
    return {barcode: key};
  }

  async getHistory(barcode: string): Promise<Checkout[]> {
    const sql = `
          select h.*, b.* from issue_history h, borrowers b
          where h.barcode = ? and h.borrowernumber = b.borrowernumber
        `;
    const query: SqlQuery = {
      sql,
      params: [barcode],
    };
    const result = await this.db.selectRows(query);
    return result.rows.map(row => checkoutsTable.fromDb(row));
  }

  override async get(barcode: string, flags: ItemFlags = {}): Promise<Item> {
    const sql = `
        select o.*, o.id as checkout_id, oi.*, oi.id as order_item_id, i.*
        from items i
        left join \`out\` o on o.barcode = i.barcode
        left join order_items oi on oi.item_id = i.id
        where i.barcode = ?
      `;
    const row = await this.db.selectRow(sql, [barcode]);
    if (!row) {
      throw httpError({
        code: 'ENTITY_NOT_FOUND',
        message: `item ${barcode} not found`,
        httpStatusCode: 404,
      });
    }
    const item: Item = this.table.fromDb(row);
    if (row.checkout_id) {
      item.checkout = checkoutsTable.fromDb(row);
      item.checkout.id = row['checkout_id'];
    }
    if (row.order_item_id) {
      item.order_item = orderItemsTable.fromDb(row);
      item.order_item.id = row['order_item_id'];
    }
    if (item.checkout) {
      const sql = `select * from borrowers where borrowernumber = ?`;
      const borrowerRow =
          await this.db.selectRow(sql, [item.checkout.borrowernumber]);
      if (borrowerRow) {
        item.borrower = borrowersTable.fromDb(borrowerRow);
      }
    }
    if (item.order_item) {
      const sql = `
          select o.*, b.*
          from orders o join borrowers b on o.borrower_id = b.id
          where o.id = ?
        `;
      const borrowerRow =
          await this.db.selectRow(sql, [item.order_item.order_id]);
      if (borrowerRow) {
        item.borrower = borrowersTable.fromDb(borrowerRow);
      }
    }
    if (flags?.history) {
      item.history = await this.getHistory(barcode);
    }
    return item;
  }

  /**
   * Adds an item to the checked-out items of a borrower.
   */
  async checkout(barcode: string, borrowernumber: number):
      Promise<CheckoutResult> {
    const [item, borrower] = await Promise.all([
      this.get(barcode),
      borrowersTable.find(this.db, {fields: {borrowernumber}}),
    ]);
    if (!borrower) {
      throw httpError({
        code: 'BORROWER_NOT_FOUND',
        message: `borrower ${borrowernumber} not found`,
        httpStatusCode: 404,
      });
    }
    if (item?.checkout) {
      throw httpError({
        code: 'ITEM_ALREADY_CHECKED_OUT',
        message: `item ${barcode} already checked out`,
      });
    }
    if (item.state !== 'CIRCULATING') {
      throw httpError({
        code: 'ITEM_NOT_CIRCULATING',
        message: `item ${barcode} is ${item.state}`,
      });
    }
    let checkout = createCheckout(barcode, borrowernumber);
    checkout = await checkoutsTable.create(this.db, checkout);
    return {item, borrower, checkout};
  }

  /**
   * Returns an item.
   */
  async checkin(barcode: string): Promise<Item> {
    const item = await this.get(barcode);
    const checkout = item.checkout;
    if (!checkout) {
      throw httpError({
        code: 'ITEM_NOT_CHECKED_OUT',
        message: `trying to check in item ${barcode} that is not checked out`,
      });
    }
    const checkoutId = checkout.id!;
    delete checkout.id;
    checkout.returndate = new Date();
    await historyTable.create(this.db, checkout);
    await checkoutsTable.remove(this.db, checkoutId);
    return item;
  }

  async renew(barcode: string): Promise<Item> {
    const item = await this.get(barcode);
    const checkout = item.checkout;
    if (!checkout) {
      throw httpError({
        code: 'ITEM_NOT_CHECKED_OUT',
        message: `trying to check in item ${barcode} that is not checked out`,
      });
    }
    const now = new Date();
    checkout.date_due = addDays(now, checkoutConfig.renewalDays);
    await checkoutsTable.update(
        this.db, {id: checkout.id, date_due: checkout.date_due});
    return item;
  }

  /**
   * Returns the promise of adding an item to a borrowers current order.
   *
   * The current order is the order associated with the current order cycle. If
   * the borrower's current order does not exist yet, it is created before
   * adding the item.
   *
   * If there is no current order cycle, an exception is throws.
   */
  async order(barcode: string, borrowernumber: number): Promise<OrderResult> {
    const now = new Date();
    const [item, borrower, cycle] = await Promise.all([
      this.find({fields: {barcode}}),
      borrowersTable.find(this.db, {fields: {borrowernumber}}),
      orderCyclesTable.getByDate(this.db, now),
    ]);
    if (!item) {
      throw httpError({code: 'ITEM_NOT_FOUND', httpStatusCode: 404});
    }
    if (!borrower) {
      throw httpError({code: 'BORROWER_NOT_FOUND', httpStatusCode: 404});
    }
    if (!cycle) {
      throw httpError({code: 'CYCLE_NOT_FOUND', httpStatusCode: 404});
    }
    const order = await ordersTable.getOrCreateBorrowerOrder(
        this.db, borrower.id, cycle.id);
    const orderItem = await orderItemsTable.create(
        this.db, {order_id: order.id!, item_id: item.id!});

    return {item, borrower, cycle, order, orderItem};
  }

  async getCheckoutReport(lastCheckoutDate: string, query: EntityQuery<Item>):
      Promise<QueryResult<Item>> {
    const itemsWhere = this.table.sqlWhere(query);
    const where = itemsWhere.where ? `where ${itemsWhere.where}` : '';
    const sql = `
      select a.*, max(h.checkout_date) as last_checkout_date
      from items a right join issue_history h on a.barcode = h.barcode
      ${where}
      group by a.barcode
      having last_checkout_date < ?
    `;
    const params = [...(itemsWhere.params ?? []), lastCheckoutDate];
    const result =
        await this.db.selectRows({sql, params, options: query.options});
    return mapQueryResult(result, row => {
      const last_checkout_date = row.last_checkout_date as string;
      return {...this.table.fromDb(row), last_checkout_date};
    });
  }

  override initRoutes(application: ExpressApp): void {
    application.addHandler({
      method: HttpMethod.POST,
      path: `${this.keyPath}/checkout`,
      handle: async (req, res) => {
        const barcode = req.params['key'];
        const borrowernumber = parseInt(req.body.borrower, 10);
        const result = await this.checkout(barcode, borrowernumber);
        res.send(result);
      },
      authAction: {resource: 'items', operation: 'checkout'},
    });
    application.addHandler({
      method: HttpMethod.POST,
      path: `${this.keyPath}/checkin`,
      handle: async (req, res) => {
        const barcode = req.params['key'];
        const result = await this.checkin(barcode);
        res.send(result);
      },
      authAction: {resource: 'items', operation: 'checkin'},
    });
    application.addHandler({
      method: HttpMethod.POST,
      path: `${this.keyPath}/renew`,
      handle: async (req, res) => {
        const barcode = req.params['key'];
        const result = await this.renew(barcode);
        res.send(result);
      },
      authAction: {resource: 'items', operation: 'renew'},
    });
    application.addHandler({
      method: HttpMethod.POST,
      path: `${this.keyPath}/order`,
      handle: async (req, res) => {
        const barcode = req.params['key'];
        const borrowernumber = req.body.borrower;
        const result = await this.order(barcode, borrowernumber);
        res.send(result);
      },
      authAction: {resource: 'items', operation: 'order'},
    });
    application.addHandler({
      method: HttpMethod.GET,
      path: `${this.apiPath}/reports/itemUsage`,
      handle: async (req, res) => {
        const lastCheckoutDate = req.query.lastCheckoutDate as string;
        const result = await this.getCheckoutReport(lastCheckoutDate, this.toEntityQuery(req.query));
        res.send(result);
      },
      authAction: {resource: 'reports', operation: 'read'},
    });
    super.initRoutes(application);
  }
}

function createCheckout(barcode: string, borrowernumber: number): Checkout {
  const checkoutDate = new Date();
  const dueDate = addDays(checkoutDate, checkoutConfig.borrowDays);
  return {
    barcode,
    borrowernumber,
    checkout_date: checkoutDate,
    date_due: dueDate,
    fine_due: 0,
    fine_paid: 0,
  };
}

export interface CheckoutResult {
  item: Item;
  borrower: Borrower;
  checkout: Checkout;
}

export interface OrderResult {
  item: Item;
  borrower: Borrower;
  cycle: OrderCycle;
  order: Order;
  orderItem: OrderItem;
}