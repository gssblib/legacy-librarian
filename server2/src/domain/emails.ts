import config from 'config';
import {BaseEntity} from '../common/base_entity';
import {dateTimeColumnDomain} from '../common/column';
import {Db} from '../common/db';
import {mapQueryResult, QueryOptions, QueryResult} from '../common/query';
import {EntityTable} from '../common/table';
import {Email} from './emailer';

export interface ReminderEmailConfig {
  sender: string;
  subject: string;
  reply_to: string;
  test_recipients?: string[];
}

export const reminderEmailConfig: ReminderEmailConfig = config.get('email');

export function createReminderEmailTemplate(): Email {
  return {
    to: '',
    from: reminderEmailConfig.sender,
    subject: reminderEmailConfig.subject,
    replyTo: reminderEmailConfig.reply_to,
    html: '',
    text: '',
  };
}

/**
 * Email sent to a borrower.
 */
export interface BorrowerEmail {
  id?: number;

  /** Id of the borrower the email was sent to. */
  borrower_id: number;

  /**
   * Email address the email was sent to (one the borrower's email addresses at
   * the time the email was sent).
   */
  recipient: string;

  /** Time when the email was sent. */
  send_time: Date|string;

  /** Email test (plain text version). */
  email_text: string;
}

export class BorrowerEmailTable extends EntityTable<BorrowerEmail> {
  constructor() {
    super({name: 'emails', tableName: 'borrower_emails'});
    super.addColumn({name: 'id'});
    super.addColumn({name: 'borrower_id'});
    super.addColumn({name: 'recipient'});
    super.addColumn({name: 'send_time', domain: dateTimeColumnDomain});
    super.addColumn({name: 'email_text'});
  }

  async getBorrowerEmails(
      db: Db, borrowernumber: number,
      options?: QueryOptions): Promise<QueryResult<BorrowerEmail>> {
    const sql = `
        select * from borrower_emails a
        left join borrowers b on a.borrower_id = b.id
        where b.borrowernumber = ?
      `;
    const result = await db.selectRows({sql, params: [borrowernumber], options});
    return mapQueryResult(result, row => this.fromDb(row));
  }

  async getLatestBorrowerEmail(db: Db, borrower_id: number):
      Promise<BorrowerEmail|undefined> {
    const sql =
        'select * from borrower_emails where borrower_id = ? order by send_time desc limit 1';
    const result = await db.selectRows({sql, params: [borrower_id]});
    const row = result.rows[0];
    return row && this.fromDb(row);
  }
}

export const borrowerEmailTable = new BorrowerEmailTable();

export class BorrowerEmails extends BaseEntity<BorrowerEmail> {
  constructor(db: Db) {
    super(db, borrowerEmailTable);
  }

  protected toKeyFields(key: string): Partial<BorrowerEmail> {
    return {id: parseInt(key)};
  }
}