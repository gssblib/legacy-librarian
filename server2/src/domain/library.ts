import config from 'config';
import mysql from 'mysql2/promise';
import {Db} from '../common/db';
import {ExpressApp} from '../common/express_app';
import {Borrowers} from './borrowers';
import {Checkouts, History} from './checkouts';
import {Items} from './items';

export const pool = mysql.createPool(config.get('db'));

export const db = new Db(pool);

const items = new Items(db);
const borrowers = new Borrowers(db);
const checkouts = new Checkouts(db);
const history = new History(db);

export function initRoutes(application: ExpressApp): void {
  items.initRoutes(application);
  borrowers.initRoutes(application);
  checkouts.initRoutes(application);
  history.initRoutes(application);
}