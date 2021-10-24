import {BaseEntity} from '../common/base_entity';
import {EnumColumnDomain, QueryOp} from '../common/column';
import {Db} from '../common/db';
import {Flags} from '../common/entity';
import {httpError} from '../common/error';
import {ExpressApp, HttpMethod} from '../common/express_app';
import {mapQueryResult, QueryOptions, QueryResult} from '../common/query';
import {EntityTable} from '../common/table';
import {addDays, dateToIsoStringWithoutTimeZone, sum} from '../common/util';
import {Checkout, checkoutConfig, checkoutsTable, historyTable} from './checkouts';
import {Email, emailer} from './emailer';
import {BorrowerEmail, createReminderEmailTemplate, reminderEmailConfig, ReminderEmailConfig} from './emails';
import {ordersTable, OrderSummary} from './orders';
import {createTemplateRenderer} from './templates';
import {User} from './user';

/**
 * Collection of checkouts (current or history) with fees.
 */
interface FeeInfo {
  /** Total of all outstanding fees. */
  total: number;

  /** Current check-outs with outstanding fees. */
  items: Checkout[];

  /** Returned items with outstanding fees. */
  history: Checkout[];
}

type BorrowerState = 'ACTIVE'|'INACTIVE';

export interface Borrower {
  /** Auto-generated id. */
  id: number;

  /** Natural key of this borrower. */
  borrowernumber: number;

  /** Child surname. */
  surname: string;

  /** List of first names of the children. */
  firstname: string;

  /** Contact names of the parents. */
  contactname: string;

  phone: string;

  /** Comma-separated list of email addresses. */
  emailaddress: string;

  /** Id of the family in the Sycamore system. */
  sycamoreid: string;

  state: BorrowerState;

  /** List of currently checked-out items. */
  items?: Checkout[];

  /**
   * Optional number of checked-out items (satisfying some condition such as
   * being overdue).
   */
  count?: number;

  /** Check-out history. */
  history?: Checkout[];

  /** Information about outstanding fees. */
  fees?: FeeInfo;

  /** Summaries of the orders of this borrower. */
  orders?: OrderSummary[];
}

const BorrowerStateDomain = new EnumColumnDomain<BorrowerState>([
  'ACTIVE',
  'INACTIVE',
]);

export class BorrowerTable extends EntityTable<Borrower> {
  constructor() {
    super({name: 'borrowers', naturalKey: 'borrowernumber'});
    this.addColumn({name: 'id'});
    this.addColumn({
      name: 'borrowernumber',
      label: 'Borrower number',
      internal: true,
    });
    this.addColumn({
      name: 'surname',
      label: 'Last name',
      queryOp: 'contains',
    });
    this.addColumn({
      name: 'firstname',
      label: 'First name',
      queryOp: 'contains',
    });
    this.addColumn({
      name: 'contactname',
      label: 'Contact name',
      queryOp: 'contains',
    });
    this.addColumn({
      name: 'phone',
      label: 'Phone number',
    });
    this.addColumn({
      name: 'emailaddress',
      required: true,
      label: 'Email',
      queryOp: 'contains',
    });
    this.addColumn({
      name: 'sycamoreid',
      label: 'Sycamore ID',
    });
    this.addColumn({
      name: 'state',
      required: true,
      domain: BorrowerStateDomain,
    });
  }
}

export const borrowersTable = new BorrowerTable();

type BorrowerFlag = 'items'|'history'|'fees'|'orders';
type BorrowerFlags = Flags<BorrowerFlag>;

interface BorrowerFeeSummary {
  borrowernumber: number;
  surname: string;
  contactname: string;
  firstname: string;
  fee: number;
}

/**
 * Data passed to the templates for the reminder emails.
 */
interface BorrowerReminderData {
  /** Borrower data with checked-out items and outstanding fees. */
  borrower: Borrower;
  /** Global configuration for the reminder emails. */
  config: ReminderEmailConfig;
}

enum BorrowerReminderResultCode {
  OK = 'OK',
  /**
   * Email skipped because borrower has no items checked out and no outstanding
   * fees.
   */
  NO_ITEMS_OR_FEES = 'NO_ITEMS_OR_FEES',

  /**
   * Email skipped because borrower has no email address.
   */
  NO_EMAIL_ADDRESS = 'NO_EMAIL_ADDRESS',

  /**
   * Email skipped because an email has already been sent within the last 24
   * hours.
   */
  EXITING_EMAIL_IN_WINDOW = 'EXITING_EMAIL_IN_WINDOW',
}

interface BorrowerReminderEmailResult {
  resultCode: BorrowerReminderResultCode;
  email?: BorrowerEmail;
}

const reminderEmailRenderer =
    createTemplateRenderer<BorrowerReminderData>('src/templates');

export class Borrowers extends BaseEntity<Borrower, BorrowerFlag> {
  constructor(db: Db) {
    super(db, borrowersTable);
  }

  protected toKeyFields(key: string): Partial<Borrower> {
    return {borrowernumber: parseInt(key, 10)};
  }

  /**
   * Returns the current check-outs of a borrower.
   *
   * @param feesOnly If true, only the items with open fees are returned
   * @param options Query options (order, pagination) used
   */
  checkouts(borrowernumber: number, feesOnly?: boolean, options?: QueryOptions):
      Promise<QueryResult<Checkout>> {
    return checkoutsTable.listBorrowerCheckoutItems(
        this.db, {borrowernumber, feesOnly, options});
  }

  /**
   * Returns the history of check-outs (returned items) of a borrower.
   *
   * @param feesOnly If true, only the items with open fees are returned
   * @param options Query options (order, pagination) used
   */
  history(borrowernumber: number, feesOnly?: boolean, options?: QueryOptions):
      Promise<QueryResult<Checkout>> {
    return historyTable.listBorrowerCheckoutItems(
        this.db, {borrowernumber, feesOnly, options});
  }

  /**
   * Returns the information about the fees (total and items with fines) of a
   * borrower.
   */
  async fees(borrowerNumber: number): Promise<FeeInfo> {
    const [checkouts, history] = await Promise.all([
      this.checkouts(borrowerNumber, true), this.history(borrowerNumber, true)
    ]);
    return {
      total: totalFine(checkouts.rows) + totalFine(history.rows),
      items: checkouts.rows,
      history: history.rows,
    };
  }

  /**
   * Returns the fee information of borrowers with outstanding fees.
   *
   * @param options Query options (order, pagination) used
   */
  async getFeeSummaries(options?: QueryOptions):
      Promise<QueryResult<BorrowerFeeSummary>> {
    delete options?.returnCount;
    // Note that the sub-selects in the union must specify the columns
    // explicitly and include a unique key so that the union matches the correct
    // columns and does not merge rows with the same borrower number and fines.
    const sql = `
      select
        b.borrowernumber, b.surname, b.contactname, b.firstname,
        sum(greatest(0, c.fine_due - c.fine_paid)) as fee
      from (
        (select 'checkout', id, borrowernumber, fine_due, fine_paid
         from ${checkoutsTable.tableName})
      union
        (select 'history', id, borrowernumber, fine_due, fine_paid
         from ${historyTable.tableName})
      ) c
      inner join borrowers b on c.borrowernumber = b.borrowernumber
      group by borrowernumber
      having fee > 0
    `;
    const countSql = `select count(1) as count from (${sql}) d`;
    const [feeResult, countResult] = await Promise.all([
      this.db.selectRows({sql, options}),
      this.db.selectRow(countSql),
    ])
    feeResult.count = countResult && countResult['count'];
    return mapQueryResult(feeResult, row => row as BorrowerFeeSummary);
  }

  /**
   * Marks all fees of a borrower as paid.
   */
  async payFees(borrowernumber: number): Promise<any> {
    const result = await Promise.all([
      this.db.execute(
          'update `out` set fine_paid = fine_due ' +
              'where fine_due > fine_paid and borrowernumber = ?',
          [borrowernumber]),
      this.db.query(
          'update issue_history set fine_paid = fine_due ' +
              'where fine_due > fine_paid and borrowernumber = ?',
          [borrowernumber]),
    ]);
    return result;
  }

  /**
   * Returns a `Borrower` with optional information subh as the checked-out
   * items and checkout history.
   */
  override async get(key: string, flags: BorrowerFlags): Promise<Borrower> {
    const borrowernumber = parseInt(key, 10);
    const borrower = await this.table.find(this.db, {fields: {borrowernumber}});
    if (!borrower) {
      throw httpError({
        code: 'BORROWER_NOT_FOUND',
        message: `borrower ${borrowernumber} not found`,
        httpStatusCode: 404
      });
    }
    if (flags.items) {
      borrower.items = (await this.checkouts(borrowernumber)).rows;
    }
    if (flags.history) {
      borrower.history = (await this.history(borrowernumber)).rows;
    }
    if (flags.fees) {
      borrower.fees = await this.fees(borrowernumber);
    }
    if (flags.orders) {
      const orderResult =
          await ordersTable.listBorrowerOrderSummaries(this.db, borrowernumber);
      borrower.orders = orderResult.rows;
    }
    return borrower;
  }

  /**
   * Renews all items that are currently checked out by a borrower.
   *
   * Only the borrower's items that were checked out after the renewal limit are
   * renewed.
   */
  async renewAllItems(borrowernumber: number): Promise<any> {
    const now = new Date();
    const newDueDate = addDays(now, checkoutConfig.renewalDays);
    const checkoutLimit = addDays(now, -checkoutConfig.renewalLimitDays);
    const sql = `
        update \`out\` a, items b 
        set a.date_due = ? 
        where borrowernumber = ? and a.barcode = b.barcode 
        and a.checkout_date > ?
      `;
    const result =
        await this.db.execute(sql, [newDueDate, borrowernumber, checkoutLimit]);
    return result;
  }

  async sendReminderEmail(key: string): Promise<BorrowerReminderEmailResult> {
    const borrower = await this.get(key, {items: true, fees: true});
    if ((!borrower.items || borrower.items.length === 0) &&
        (!borrower.fees || borrower.fees.total === 0)) {
      return {
        resultCode: BorrowerReminderResultCode.NO_ITEMS_OR_FEES,
      };
    }
    const recipient = borrower.emailaddress.split(',')[0];
    if (!recipient) {
      return {
        resultCode: BorrowerReminderResultCode.NO_EMAIL_ADDRESS,
      };
    }
    const reminderData: BorrowerReminderData = {
      borrower,
      config: reminderEmailConfig,
    };
    const emailText = await reminderEmailRenderer.render(
        'reminder_email_tmpl.txt', reminderData);
    const emailHtml = await reminderEmailRenderer.render(
        'reminder_email_tmpl.html', reminderData);
    const email: Email = {
      ...createReminderEmailTemplate(),
      to: recipient,
      text: emailText,
      html: emailHtml,
    };
    const result = await emailer.send(email);
    const borrowerEmail: BorrowerEmail = {
      borrower_id: borrower.id,
      send_time: new Date(),
      recipient,
      email_text: emailText,
    };
    return {
      resultCode: BorrowerReminderResultCode.OK,
      email: borrowerEmail,
    };
  }

  /**
   * Returns the borrowers with items that were checked out before the
   * `lastCheckoutDate`.
   *
   * @param lastCheckoutDate ISO date string, for example, "2020-10-15"
   * @param options Optional query options passed to query
   */
  async getBorrowersWithOverdueItems(
      lastCheckoutDate: string,
      options?: QueryOptions): Promise<QueryResult<Borrower>> {
    const sql = `
      select b.*, c.count from borrowers b
      right join (
        select borrowernumber, count(1) as count
        from \`out\` a where a.checkout_date < ?
        group by borrowernumber
      ) c on b.borrowernumber = c.borrowernumber
    `;
    const params = [lastCheckoutDate];
    const result = await this.db.selectRows({sql, params, options})
    return mapQueryResult(
        result, row => ({...this.table.fromDb(row), count: row.count}));
  }

  initRoutes(application: ExpressApp): void {
    application.addHandler({
      method: HttpMethod.GET,
      path: `${this.keyPath}/history`,
      handle: async (req, res) => {
        const key = req.params['key'] ?? '';
        const borrowernumber = parseInt(key, 10);
        const result = await this.history(
            borrowernumber, false, this.toQueryOptions(req.query));
        res.send(result);
      },
      authAction: {resource: 'borrowers', operation: 'read'},
    });
    application.addHandler({
      method: HttpMethod.POST,
      path: `${this.keyPath}/renewAllItems`,
      handle: async (req, res) => {
        const key = req.params['key'] ?? '';
        const borrowernumber = parseInt(key, 10);
        const result = await this.renewAllItems(borrowernumber);
        res.send(result);
      },
      authAction: {resource: 'borrowers', operation: 'renewAllItems'},
    });
    application.addHandler({
      method: HttpMethod.POST,
      path: `${this.keyPath}/payFees`,
      handle: async (req, res) => {
        const key = req.params['key'] ?? '';
        const borrowernumber = parseInt(key, 10);
        const result = await this.payFees(borrowernumber);
        res.send(result);
      },
      authAction: {resource: 'borrowers', operation: 'renewAllItems'},
    });
    application.addHandler({
      method: HttpMethod.POST,
      path: `${this.keyPath}/sendEmail`,
      handle: async (req, res) => {
        const key = req.params['key'] ?? '';
        const result = await this.sendReminderEmail(key);
        res.send(result);
      },
      authAction: {resource: 'borrowers', operation: 'sendEmail'},
    });
    application.addHandler({
      method: HttpMethod.GET,
      path: `${this.apiPath}/fees`,
      handle: async (req, res) => {
        const result =
            await this.getFeeSummaries(this.toQueryOptions(req.query));
        res.send(result);
      },
      authAction: {resource: 'fees', operation: 'read'},
    });
    application.addHandler({
      method: HttpMethod.GET,
      path: `${this.apiPath}/me`,
      handle: async (req, res) => {
        const user = req.user;
        const appUser = user as User;
        const id = appUser.id;
        const borrower = await this.get(id ?? '', {items: true, fees:true});
        res.send(borrower);
      },
      authAction: {resource: 'profile', operation: 'read'},
    });
    application.addHandler({
      method: HttpMethod.GET,
      path: `${this.apiPath}/reports/overdue`,
      handle: async (req, res) => {
        const lastCheckoutDate = req.query.last_checkout_date as string;
        const result =
            await this.getBorrowersWithOverdueItems(lastCheckoutDate);
        res.send(result);
      },
      authAction: {resource: 'reports', operation: 'read'},
    });
    super.initRoutes(application);
  }
}

/**
 * Returns the total of unpaid fines of the `checkouts`.
 */
function totalFine(checkouts: Checkout[]): number {
  return sum(
      checkouts.map(item => Math.max(0, item.fine_due - item.fine_paid)));
}
