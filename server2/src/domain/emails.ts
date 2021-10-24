import config from 'config';
import {BaseEntity} from '../common/base_entity';
import {dateTimeColumnDomain} from '../common/column';
import {Db} from '../common/db';
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