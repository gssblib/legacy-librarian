import csv
import pymysql
import sys


def load_code(csv_row, conn):
    emails = csv_row[4][2:].strip()
    if not emails:
        return
    emails = filter(None, emails.split(', '))
    code = csv_row[1][2:]
    fname = csv_row[2][2:]
    print '-----------------------------------------------------------'
    print '- %s' % code
    print '    + Emails: %s' % emails
    print '    + Family: %s' % fname
    email_qry = ' or '.join(
        "emailaddress like '%%%s%%'" % email for email in emails)
    find_qry = (
        "select surname, contactname, state, borrowernumber, emailaddress "
        "from borrowers where state = 'ACTIVE' and (" + email_qry + ")")
    cur = conn.cursor()
    cur.execute(find_qry);
    result = tuple(cur)
    if len(result) == 0:
        print '    --> ERROR: NO RESULT FOUND'
        return
    if len(result) > 1:
        print '    --> ERROR: MULTIPLE RESULTS FOUND'
    for row in result:
        print '    + Result: %s, %s (%s - %s)' % row[:4]
        print '              %s' % row[4]

    update_qry = (
        "update borrowers set sycamoreid = '%s' where borrowernumber = %s" % (
            code, result[0][3])
        )
    cur = conn.cursor()
    # Only update the first found borrower, otherwise we will have a problem.
    cur.execute(update_qry);


def load_codes(csv_path):
    conn = pymysql.connect(user='gssb', password='gssblib', database='spils')
    with open(csv_path, 'rb') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            load_code(row, conn)
    conn.commit()

if __name__ == '__main__':
    load_codes(sys.argv[1])
