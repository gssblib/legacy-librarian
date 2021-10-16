import {BaseEntity} from './base_entity';
import {Checkout, checkoutsTable, historyTable} from './checkouts';
import {ColumnDomain, DomainTypeEnum} from './column';
import {Db} from './db';
import { Flags } from './entity';
import {EntityQuery} from './query';
import {EntityConfig, EntityTable} from './table';
import {sum} from './util';

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

  async checkouts(borrowernumber: number): Promise<Checkout[]> {
    const query: EntityQuery<Checkout> = {
      fields: {borrowernumber},
    };
    return (await checkoutsTable.list(this.db, query)).rows;
  }

  async history(borrowernumber: number): Promise<Checkout[]> {
    const query: EntityQuery<Checkout> = {
      fields: {borrowernumber},
    };
    return (await historyTable.list(this.db, query)).rows;
  }

  async fees(borrowerNumber: number): Promise<FeeInfo> {
    const [items, history] = await Promise.all(
        [this.checkouts(borrowerNumber), this.history(borrowerNumber)]);
    return {
      total: totalFine(items) + totalFine(history),
      items,
      history,
    };
  }

  async get(key: string, flags: BorrowerFlags): Promise<Borrower|undefined> {
    const borrowernumber = parseInt(key, 10);
    const borrower = await this.table.find(this.db, {borrowernumber});
    if (!borrower) {
      return undefined;
    }
    if (flags.items) {
      borrower.items = await this.checkouts(borrowernumber);
    }
    if (flags.history) {
      borrower.history = await this.history(borrowernumber);
    }
    if (flags.fees) {
      borrower.fees = await this.fees(borrowernumber);
    }
    return borrower;
  }
}

function totalFine(checkouts: Checkout[]): number {
  return sum(checkouts.map(item => item.fine_due - item.fine_paid));
}
