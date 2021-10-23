import {BaseEntity} from '../common/base_entity';
import {dateTimeColumnDomain} from '../common/column';
import {Db} from '../common/db';
import {Flags} from '../common/entity';
import {httpError} from '../common/error';
import {mapQueryResult, QueryOptions, QueryResult} from '../common/query';
import {SqlQuery} from '../common/sql';
import {EntityTable} from '../common/table';
import {dateToIsoStringWithoutTimeZone} from '../common/util';
import {Borrower, borrowersTable} from './borrowers';
import {Item, itemsTable} from './items';

// The order tables form a hierarchy
//
//   order_cycles: id, order_wndow_start, order_window_end
//     orders: id, order_cycle_id, borrower_id
//       order_items: id, order_id, item_id
//
// In addion, an order is linked to a borrower, and an order item to an item.
//
// When fetching these objects, we are often interested in the child and
// linked objects such as the orders of an order cycle or the item of an
// order item.
//
// We therefore include these linked objects as optional fields in the
// entity objects (in addition to the columns of the respective tables).

/**
 * An `OrderCycle` represents the an order-and-pickup cycle (for example,
 * weekly or two-week cycle).
 */
export interface OrderCycle {
  id: number;
  order_window_start: Date|string;
  order_window_end: Date|string;

  /** Optional orders belonging to this order cycle. */
  orders?: Order[];
}

/**
 * An `Order` represents the items ordered by a borrower during an order cycle.
 */
export interface Order {
  id?: number;
  borrower_id: number;
  order_cycle_id: number;

  /** Optionally fetched order cycle this order belongs to. */
  cycle?: OrderCycle;

  /** Optionally fetched borrower this order belongs to. */
  borrower?: Borrower;

  /** Optionally fetched order items belonging to this order. */
  items?: OrderItem[];
}

/**
 * Single item of an order.
 */
export interface OrderItem extends Partial<Item> {
  id?: number;
  order_id: number;
  item_id: number;
}

export interface OrderSummary {
  id: number;
  order_cycle_id: number;
  borrower_id: number;
  cycle?: OrderCycle;
  item_count: number;
}

export class OrderCycleTable extends EntityTable<OrderCycle> {
  constructor() {
    super({name: 'ordercycles', tableName: 'order_cycles'});
    this.addColumn({name: 'id'});
    this.addColumn({
      name: 'order_window_start',
      label: 'Start',
      domain: dateTimeColumnDomain,
    });
    this.addColumn({
      name: 'order_window_end',
      label: 'End',
      domain: dateTimeColumnDomain,
    });
  }

  async getOrderCycle(db: Db, id: number): Promise<OrderCycle> {
    const ordersSql = `
        select b.*, o.*
        from orders o
        inner join borrowers b on b.id = o.borrower_id
        where o.order_cycle_id = ?
      `;
    const [cycleRow, ordersResult] = await Promise.all([
      db.selectRow('select * from order_cycles where id = ?', [id]),
      db.selectRows({sql: ordersSql, params: [id]}),
    ]);
    const cycle = cycleRow as OrderCycle;
    const orders: Order[] = ordersResult.rows.map(row => {
      const order = ordersTable.fromDb(row);
      return {
        ...order,
        borrower: borrowersTable.fromDb(row),
      };
    });
    return {...cycle, orders};
  }

  private readonly orderCycleByDate = `
      select c.*
      from order_cycles c
      where c.order_window_start <= ? and c.order_window_end >= ?
    `;

  async getByDate(db: Db, date: Date|string): Promise<OrderCycle> {
    const arg = dateToIsoStringWithoutTimeZone(date);
    const row = await db.selectRow(this.orderCycleByDate, [arg, arg]);
    return row as OrderCycle;
  }

  /**
   * Returns the order cycles that overlap the date-time range from `start` to
   * `end`.
   */
  async getOverapping(db: Db, start: Date|string, end: Date|string):
      Promise<OrderCycle[]> {
    const sql = `
        select o.* from order_cycles o
        where o.order_window_start between ? and ?
        or    o.order_window_end between ? and ?
        or    ? between o.order_window_start and o.order_window_end
        or    ? between o.order_window_start and o.order_window_end
      `;
    const dbStart = dateToIsoStringWithoutTimeZone(start);
    const dbEnd = dateToIsoStringWithoutTimeZone(end);
    const result = await db.selectRows(
        {sql, params: [dbStart, dbEnd, dbStart, dbEnd, dbStart, dbEnd]});
    return result.rows.map(row => row as OrderCycle);
  }
}

export const orderCyclesTable = new OrderCycleTable();

export class OrderCycles extends BaseEntity<OrderCycle> {
  constructor(db: Db) {
    super(db, orderCyclesTable);
  }

  override get(key: string): Promise<OrderCycle> {
    return orderCyclesTable.getOrderCycle(this.db, parseInt(key));
  }

  protected toKeyFields(key: string): Partial<OrderCycle> {
    return {id: parseInt(key, 10)};
  }
}

export class OrderItemTable extends EntityTable<OrderItem> {
  constructor() {
    super({name: 'orderitems', tableName: 'order_items'});
    this.addColumn({name: 'id'});
    this.addColumn({name: 'order_id'});
    this.addColumn({name: 'item_id'});
  }
}

export const orderItemsTable = new OrderItemTable();

export class OrderTable extends EntityTable<Order> {
  constructor() {
    super({name: 'orders'});
    this.addColumn({name: 'id'});
    this.addColumn({name: 'borrower_id'});
    this.addColumn({name: 'order_cycle_id'});
  }

  /**
   * Gets an order with all the linked information (order cycle, borrower, order
   * items with linked items).
   */
  async getOrder(db: Db, id: number, flags?: OrderFlags): Promise<Order> {
    // We use two queries, one for the order, order cycle, and borrower and
    // another one for the order items and their linked items.
    //
    // The order columns are selected last to that the id is the order id.
    const orderSql = `
      select c.*, b.*, o.*
      from orders o
      inner join order_cycles c on o.order_cycle_id = c.id
      inner join borrowers b on o.borrower_id = b.id
      where o.id = ?
    `;
    const orderItemsSql = `
      select oi.*, i.*
      from order_items oi
      inner join items i on oi.item_id = i.id
      where oi.order_id = ?
    `;
    const [orderRow, itemsResult] = await Promise.all([
      await db.selectRow(orderSql, [id]),
      await db.selectRows({sql: orderItemsSql, params: [id]})
    ]);
    if (!orderRow) {
      throw httpError({
        code: 'ENTITY_NOT_FOUND',
        message: `order ${id} not found`,
        httpStatusCode: 404,
      })
    }
    const borrower: Borrower = {
      ...borrowersTable.fromDb(orderRow),
      id: orderRow.borrower_id
    };
    const cycle: OrderCycle = {
      ...orderCyclesTable.fromDb(orderRow),
      id: orderRow.order_cycle_id
    };
    const orderItems: OrderItem[] = itemsResult.rows.map(row => {
      const item: Item = itemsTable.fromDb(row);
      const orderItem: OrderItem = {...item, ...orderItemsTable.fromDb(row)};
      return orderItem;
    });
    const order: Order = {
      ...this.fromDb(orderRow),
      borrower,
      cycle,
      items: orderItems,
    };
    return order;
  }

  async getOrCreateBorrowerOrder(
      db: Db, borrower_id: number, order_cycle_id: number): Promise<Order> {
    const sql = `
        select o.*
        from orders o
        where o.borrower_id = ? and o.order_cycle_id = ?
      `;
    const orderRow = await db.selectRow(sql, [borrower_id, order_cycle_id]);
    if (orderRow) {
      return orderRow as Order;
    }
    return this.create(db, {borrower_id, order_cycle_id})
  }

  /**
   * Returns summaries of the orders of a borrower.
   */
  async listBorrowerOrderSummaries(
      db: Db, borrowernumber: number,
      options?: QueryOptions): Promise<QueryResult<OrderSummary>> {
    const sql = `
        select c.order_window_start, c.order_window_end, o.*, count(i.id) as item_count
        from orders o
          inner join borrowers b on o.borrower_id = b.id
          inner join order_cycles c on c.id = o.order_cycle_id
          left join order_items i on i.order_id = o.id
        where b.borrowernumber = ?
        group by o.id
      `;
    const sqlQuery: SqlQuery = {
      sql,
      params: [borrowernumber],
      options,
    };
    const result = await db.selectRows(sqlQuery);
    return mapQueryResult(
        result, row => ({
                  id: row.id,
                  borrower_id: row.borrower_id,
                  order_cycle_id: row.order_cycle_id,
                  item_count: row.item_count,
                  cycle: {
                    id: row.order_cycle_id,
                    order_window_start: row.order_window_start,
                    order_window_end: row.order_window_end,
                  },
                }));
  }

  /**
   * Removes an item from an order.
   */
  async removeBorrowerOrderItem(
      db: Db, borrowerNumber: number, orderId: number, itemId: number) {
    const orderSql = `
        select o.*
        from borrowers b inner join orders o on b.id = o.borrower_id
        where b.borrowernumber = ? and o.id = ?
      `;
    const orderRow = await db.selectRow(orderSql, [borrowerNumber, orderId]);
    if (!orderRow) {
      throw httpError({
        code: 'ENTITY_NOT_FOUND',
        message: `no order ${orderId} found for borrower ${borrowerNumber}`,
        httpStatusCode: 404,
      })
    }
    const itemSql = `
        delete from order_items where order_id = ? and item_id = ?
      `;
    const result = db.execute(itemSql, [orderId, itemId]);
    return result;
  }
}


export const ordersTable = new OrderTable();

type OrderFlag = 'items';
type OrderFlags = Flags<OrderFlag>;

export class Orders extends BaseEntity<Order, OrderFlag> {
  constructor(db: Db) {
    super(db, ordersTable);
  }

  async get(key: string, flags?: OrderFlags): Promise<Order> {
    const id = parseInt(key, 10);
    return ordersTable.getOrder(this.db, id, flags);
  }

  protected toKeyFields(key: string): Partial<Order> {
    return {
      id: parseInt(key, 10),
    };
  }
}