import config from 'config';
import mysql from 'mysql2/promise';
import {Db} from '../common/db';
import {ExpressApp} from '../common/express_app';
import {Borrowers} from './borrowers';
import {Checkouts, History} from './checkouts';
import {Items} from './items';
import {OrderCycles, Orders} from './orders';

export const pool = mysql.createPool(config.get('db'));

export const db = new Db(pool);

export const borrowers = new Borrowers(db);
const items = new Items(db);
const checkouts = new Checkouts(db);
const history = new History(db);
const orderCycles = new OrderCycles(db);
const orders = new Orders(db);

export function initRoutes(application: ExpressApp): void {
  items.initRoutes(application);
  borrowers.initRoutes(application);
  checkouts.initRoutes(application);
  history.initRoutes(application);
  orderCycles.initRoutes(application);
  orders.initRoutes(application);
}