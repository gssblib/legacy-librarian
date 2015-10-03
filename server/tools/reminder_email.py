#!/usr/bin/python
# Reminder emails for borrowers with at least one checked-out item.

import datetime
import jinja2
import logging
import mysql.connector
import os
import sys

import common

# Jinja Setup

def _create_jinja_environment():
    """Returns a custom jinja environment reading the templates from
    this directory and avoiding 'None' strings in the output.
    """
    def none_to_empty_string(s):
        return u"" if s is None else s

    def pluralize(count, singular = '', plural = 's'):
        return singular if count == 1 else plural

    jinja_env = jinja2.Environment(
        loader=jinja2.FileSystemLoader('.'),
        finalize=none_to_empty_string)

    jinja_env.filters['pluralize'] = pluralize
    return jinja_env


_jinja_environment = _create_jinja_environment()

_reminder_templates = {
    'text': _jinja_environment.get_template('reminder_email_tmpl.txt'),
    'html': _jinja_environment.get_template('reminder_email_tmpl.html')
    }


# Data objects

class Loan(object):
    """A checked-out item."""
    def __init__(self, barcode, title, description, author, media,
                 checkout_date, date_due, fine_due, fine_paid):
        self.barcode = barcode
        self.title = title
        self.description = description
        self.author = author
        self.media = media
        self.checkout_date = checkout_date
        self.date_due = date_due
        self.fine_due = fine_due
        self.fine_paid = fine_paid

    def __repr__(self):
        return 'Loan(%s, %s)' % (
            self.barcode,
            self.date_due)


class Borrower(object):
    """A borrower and its checked-out items."""
    def __init__(self, number, first_name, surname,
                 emails):
        self.number = number
        self.first_name = first_name
        self.surname = surname
        self.emails = emails
        self.loans = []
        self.old_fine = 0

    def add_loan(self, loan):
        self.loans.append(loan)

    def fine_due(self):
        return self.old_fine + sum(
            loan.fine_due for loan in self.loans if loan.fine_paid == 0)

    def __repr__(self):
        return 'Borrower(%s, %s, %s, %s, %s, %s)' % (
            self.number,
            self.first_name,
            self.surname,
            self.emails,
            self.loans,
            self.old_fine)


class LibraryStore(object):
    """Gets the borrowers and loans from the database."""

    # SQL query retrieving borrowers and their checked-out items
    # in one go.
    get_loans_sql = """
    select
      b.borrowernumber, b.firstname, b.surname,
      b.emailaddress, b.emailaddress_2,
      i.barcode, i.title, i.description, i.author, i.media,
      o.checkout_date, o.date_due, o.fine_due, o.fine_paid
    from `out` o
    inner join borrowers b on o.borrowernumber = b.borrowernumber
    inner join items i on o.barcode = i.barcode
    order by b.borrowernumber
    """

    # SQL query retrieving the outstanding fees for items that
    # have already been returned.
    get_fees_sql = """
    select
      b.borrowernumber, sum(h.fine_due - h.fine_paid) as fine
    from issue_history h
    inner join borrowers b on h.borrowernumber = b.borrowernumber
    group by b.borrowernumber
    """

    def __init__(self, connection):
        self.connection = connection

    def get_borrowers(self):
        # borrower data indexed by borrower number
        borrowers = {}

        # borrowers and their checked-out items
        cursor = self.connection.cursor()
        cursor.execute(self.get_loans_sql)
        borrower = None
        for data in cursor.fetchall():
            borrower_number = data[0]
            if borrower is None or borrower.number != borrower_number:
                assert borrower_number not in borrowers
                emails = [email for email in data[3:5] if email]
                borrower = Borrower(
                    borrower_number, data[1], data[2], emails)
                borrowers[borrower_number] = borrower
            borrower.add_loan(Loan(*data[5:]))

        # add outstanding fees for returned items
        cursor.execute(self.get_fees_sql)
        for borrower_number, fine in cursor.fetchall():
            if borrower_number in borrowers:
                borrower = borrowers[borrower_number]
                borrower.old_fine = fine

        return sorted(borrowers.values(), key=lambda b: b.surname)


# Reminder email generation

class ReminderConfig(object):
    def __init__(self, sender, subject, reply_to):
        self.sender = sender
        self.subject = subject
        self.reply_to = reply_to


class Reminder(object):
    """Main service object creating and sending the reminder emails."""
    def __init__(
            self, library, smtp_client, excluded_recipients,
            templates, config):
        self.library = library
        self.smtp_client = smtp_client
        self.excluded_recipients = excluded_recipients
        self.templates = templates
        self.config = config
        self.template_email = common.Email(
                sender=config.sender, subject=config.subject)

    def generate_emails_from_db(self, test=False):
        """Creates the reminder emails for the borrowers. Returns
        the list of borrowers and an iterable of the emails.
        """
        borrowers = self.library.get_borrowers()
        return borrowers, self.generate_emails(borrowers, test)

    def generate_emails(self, borrowers, test=False):
        """Generates the reminder emails to be sent out. The emails are
        returned as a generator of Email objects.
        """
        for borrower in borrowers:
            if borrower.emails:
                # Generate email only for first address for now.
                recipient = borrower.emails[0]
                if '@' in recipient and not recipient in self.excluded_recipients:
                    yield self.generate_email(
                        borrower, borrower.emails[0], test=test)

    def generate_email(self, borrower, recipient, test=False):
        """Generates a single reminder email for a borrower with the given
        recipient. If 'test' is true, the email will contain a test disclaimer
        message.
        """
        text = self.render_email(self.templates['text'], borrower, test)
        html = self.render_email(self.templates['html'], borrower, test)
        return common.Email(recipient=recipient, text=text, html=html)

    def render_email(self, template, borrower, test):
        return template.render(
            borrower=borrower, test=test, config=self.config)

    def write_emails_to_file(self, file, recipient_file=None):
        """Writes all reminder emails to a single file so that one
        can check them before sending them out.
        """
        borrowers, emails = reminder.generate_emails_from_db()
        for email in emails:
            email.merge(self.template_email)
            file.write(email.get_message().as_string())
            file.write('\n')
            if recipient_file:
                recipient_file.write(email.recipient + "\n")
        file.write("borrowers: %d\n" % len(borrowers))
        file.write("loans: %d\n" % sum(
            len(borrower.loans) for borrower in borrowers))

    def send_emails(self, recipient_file=None):
        """Generates and sends the reminder emails."""
        borrowers, emails = reminder.generate_emails_from_db()
        for email in emails:
            email.merge(self.template_email)
            self.smtp_client.send(email)
            if recipient_file:
                recipient_file.write(email.recipient + "\n")

    def send_test_email(self, recipients):
        """Sends a test email to the given recipients instead of the real
        recipient.
        """
        borrowers, emails = reminder.generate_emails_from_db(test=True)
        for email in emails:
            if email.recipient in recipients:
                print 'sending reminder email to', email.recipient
                email.merge(self.template_email)
                self.smtp_client.send(email)

# Configuration and Connections

def _open_db_connection(config):
  """Returns a new connection to the mysql database using the connection
  parameters given in the config.
  """
  return mysql.connector.connect(
      host=config['host'],
      user=config['user'],
      password=config['password'],
      db=config['database'])


def _open_smtp(config):
  """Returns a new connection to the SMTP server using the connection
  parameters given in the config.
  """
  return common.SmtpClient(
      host=config['host'],
      port=config['port'],
      username=config['user'],
      password=config['password'])


if __name__ == '__main__':
    command = "file" if len(sys.argv) < 2 else sys.argv[1]
    exclusion_file = None if len(sys.argv) < 3 else sys.argv[2]

    excluded_recipients = set(
        [line.strip() for line in open(exclusion_file)]
        if exclusion_file and os.path.exists(exclusion_file) else [])

    recipient_file = exclusion_file and open(exclusion_file, "a")

    config = common.get_json_config(os.environ['NODE_ENV'])
    email_config = config['email']

    connection = _open_db_connection(config['db'])
    library = LibraryStore(connection)
    smtp_client = _open_smtp(config['smtp'])

    reminder_config = ReminderConfig(
            email_config['sender'],
            email_config['subject'],
            email_config['reply_to'])
    reminder = Reminder(
        library, smtp_client, excluded_recipients,
        _reminder_templates, reminder_config)

    if command == "test":
        print "sending test email"
        reminder.send_test_email(email_config['test_recipients'])
    elif command == "file":
        filename = "emails.txt"
        print "writing reminder emails to", filename
        reminder.write_emails_to_file(open(filename, "w"), recipient_file)
    elif command == "email":
        print "sending reminder emails"
        reminder.send_emails(recipient_file)
    else:
        print "invalid command:", command

