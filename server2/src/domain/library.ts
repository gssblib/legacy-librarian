import * as express from 'express';
import mysql from 'mysql2/promise';
import {Borrowers} from './borrowers';
import {Checkouts, History} from './checkouts';
import {Db} from '../common/db';
import {Items} from './items';
import config from 'config';

export const pool = mysql.createPool(config.get('db'));

export const db = new Db(pool);

const items = new Items(db);
const borrowers = new Borrowers(db);
const checkouts = new Checkouts(db);
const history = new History(db);

export function initRoutes(app: express.Application): void {
  items.initRoutes(app);
  borrowers.initRoutes(app);
  checkouts.initRoutes(app);
  history.initRoutes(app);
}