import * as express from 'express';
import {BaseEntity} from '../common/base_entity';
import {ColumnDomain, DomainTypeEnum} from '../common/column';
import {Db} from '../common/db';
import {Flags} from '../common/entity';
import {EntityQuery, QueryResult} from '../common/query';
import {EntityConfig, EntityTable} from '../common/table';
import {sum} from '../common/util';
import {Checkout, checkoutsTable, historyTable} from './checkouts';

export interface Borrower {
  id: number;
  borrowernumber: number;
  surname: string;
  firstname: string;
  contactname: string;
  phone: string;
  emailaddress: string;
  sycamoreid: string;
  state: string;
  cardnumber: string;
  items?: Checkout[];
  history?: Checkout[];
  fees?: FeeInfo;
}

const BorrowerState: ColumnDomain<string> = {
  type: DomainTypeEnum.ENUM,
  options: [
    'ACTIVE',
    'INACTIVE',
  ],
};

const config: EntityConfig<Borrower> = {
  name: 'borrowers',
  columns: [
    {name: 'id'},
    {name: 'borrowernumber', label: 'Borrower number', internal: true},
    {name: 'surname', label: 'Last name', queryOp: 'contains'},
    {name: 'firstname', label: 'First name', queryOp: 'contains'},
    {name: 'contactname', label: 'Contact name', queryOp: 'contains'},
    {name: 'phone', label: 'Phone number'},
    {name: 'emailaddress', required: true, label: 'Email', queryOp: 'contains'},
    {name: 'sycamoreid', label: 'Sycamore ID'},
    {name: 'state', required: true},
  ],
  naturalKey: 'borrowernumber',
};

export const borrowersTable = new EntityTable<Borrower>(config);

interface FeeInfo {
  total: number;
  items: Checkout[];
  history: Checkout[];
}

type BorrowerFlag = 'items'|'history'|'fees';
type BorrowerFlags = Flags<BorrowerFlag>;

export class Borrowers extends BaseEntity<Borrower, BorrowerFlag> {
  constructor(db: Db) {
    super(db, borrowersTable);
  }

  protected toKeyFields(key: string): Partial<Borrower> {
    return {borrowernumber: parseInt(key, 10)};
  }

  async checkouts(borrowernumber: number, feesOnly?: boolean): Promise<Checkout[]> {
    const query: EntityQuery<Checkout> = {
      fields: {borrowernumber},
    };
    return (await checkoutsTable.listCheckoutItems(this.db, query)).rows;
  }

  history(borrowernumber: number): Promise<QueryResult<Checkout>> {
    const query: EntityQuery<Checkout> = {
      fields: {borrowernumber},
    };
    return historyTable.listCheckoutItems(this.db, query);
  }

  async fees(borrowerNumber: number): Promise<FeeInfo> {
    const [items, history] = await Promise.all(
        [this.checkouts(borrowerNumber), this.history(borrowerNumber)]);
    const historyItems = history.rows;
    return {
      total: totalFine(items) + totalFine(historyItems),
      items,
      history: historyItems,
    };
  }

  async get(key: string, flags: BorrowerFlags): Promise<Borrower|undefined> {
    const borrowernumber = parseInt(key, 10);
    const borrower = await this.table.find(this.db, {fields: {borrowernumber}});
    if (!borrower) {
      return undefined;
    }
    if (flags.items) {
      borrower.items = await this.checkouts(borrowernumber);
    }
    if (flags.history) {
      borrower.history = (await this.history(borrowernumber)).rows;
    }
    if (flags.fees) {
      borrower.fees = await this.fees(borrowernumber);
    }
    return borrower;
  }

  initRoutes(app: express.Application): void {
    app.get(`${this.basePath}/:key/history`, async (req, res) => {
      const key = req.params['key'] ?? '';
      const result = await this.history(parseInt(key, 10));
      res.send(result);
    });
    super.initRoutes(app);
  }
}

function totalFine(checkouts: Checkout[]): number {
  return sum(checkouts.map(item => item.fine_due - item.fine_paid));
}
