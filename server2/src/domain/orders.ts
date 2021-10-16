import {BaseEntity} from '../common/base_entity';
import {Db} from '../common/db';
import {EntityConfig, EntityTable} from '../common/table';

export interface OrderCycle {
  order_window_start: string;
  order_window_end: string;
}

const orderCyclesConfig: EntityConfig<OrderCycle> = {
  name: 'ordercycles',
  tableName: 'order_cycles',
  columns: [
    {name: 'order_window_start', label: 'Start'},
    {name: 'order_window_end', label: 'End'},
  ],
}

export const orderCyclesTable = new EntityTable<OrderCycle>(orderCyclesConfig);

export interface OrderItem {
  borrower_id: number;
  order_id: number;
  order_cycle_id: number;
}

const orderItemsConfig: EntityConfig<OrderItem> = {
  name: 'orderitems',
  tableName: 'order_items',
  columns: [],
};

export const orderItemsTable = new EntityTable<OrderItem>(orderItemsConfig);

export interface Order {}

const ordersConfig: EntityConfig<Order> = {
  name: 'orders',
  columns: [],
};

export const ordersTable = new EntityTable<Order>(ordersConfig);

export class Orders extends BaseEntity<Order> {
  constructor(db: Db) {
    super(db, ordersTable);
  }

  protected toKeyFields(key: string): Partial<Order> {
    return {
      id: parseInt(key, 10),
    };
  }
}