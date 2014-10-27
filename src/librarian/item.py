##############################################################################
#
# Copyright (c) 2014 German Saturday School Boston
# All Rights Reserved.
#
##############################################################################
"""Item REST Views"""
import datetime
from flask import jsonify, request

from librarian import json
from librarian.app import app, log, get_cursor, result

CHECKOUT_DURATION = 21 # days
ITEM_FIELDS = (('barcode', None, unicode),
               ('description', None, unicode),
               ('title', None, unicode),
               ('author', None, unicode),
               ('subject', None, unicode),
               ('publicationyear', None, int),
               ('publishercode', None, unicode),
               ('age', None, unicode),
               ('media', None, unicode),
               ('serial', None, int),
               ('seriestitle', None, unicode),
               ('classification', None, unicode),
               ('country', None, unicode),
               ('itemnotes', None, unicode),
               ('replacementprice', None, float),
               ('issues', None, int))

@app.route('/items', methods=['GET'])
def get_items():
    """Get a list of all items"""
    cursor = get_cursor()
    cursor.execute('SELECT * FROM items;')
    return result(200, 'Ok', {'result': cursor.fetchall()})

@app.route('/items/<item>', methods=['GET'])
def get_item(item):
    """Get an item."""
    cursor = get_cursor()
    cursor.execute('SELECT * FROM items where id = %s;', (int(item),))
    return result(200, 'Ok', {'result': cursor.fetchone()})

@app.route('/items/new', methods=['GET', 'POST'])
def add_item():
    """Add an item."""
    data = {}
    for field_name, default, type in ITEM_FIELDS:
        value = request.args.get(field_name)
        value = type(value) if value is not None else default
        data[field_name] = value
    data['added'] = datetime.datetime.now()

    cursor = get_cursor()
    cursor.execute(
        """
        INSERT INTO items (
            barcode,
            description,
            title,
            author,
            subject,
            publicationyear,
            publishercode,
            age,
            media,
            serial,
            seriestitle,
            classification,
            country,
            itemnotes,
            replacementprice,
            issues,
            added)
        VALUES (
            %(barcode)s,
            %(description)s,
            %(title)s,
            %(author)s,
            %(subject)s,
            %(publicationyear)s,
            %(publishercode)s,
            %(age)s,
            %(media)s,
            %(serial)s,
            %(seriestitle)s,
            %(classification)s,
            %(country)s,
            %(itemnotes)s,
            %(replacementprice)s,
            %(issues)s,
            %(added)s
            );
        """, data)
    cursor.execute('SELECT LAST_INSERT_ID() as id;')
    return result(200, 'Ok', {'result': cursor.fetchone()})


@app.route('/items/<item>', methods=['POST'])
@app.route('/items/<item>/edit', methods=['GET', 'POST'])
def edit_item(item):
    """Edit an item."""
    data = {}
    for field_name, default, type in ITEM_FIELDS:
        if field_name in request.args:
            data[field_name] = type(request.args[field_name])
    data['id'] = int(item)
    cursor = get_cursor()
    cursor.execute(
        """
        UPDATE items
        SET
          %s
        WHERE id = %%(id)s
        """ %', '.join(['%s = %%(%s)s' %(n, n) for n in data if n != 'id']),
        data)
    return result(200, 'Ok', {'result': {'id': int(item)}})


@app.route('/checkout', methods=['GET', 'POST'])
def checkout_item():
    """Check-out an item for a borrower.

    Parameters: barcode [string], borrower [string]
    Output: Status of the checkout.
    """
    # Get the barcode from the request
    barcode = request.args.get('barcode')
    if barcode is None:
        return result(410, 'Missing barcode')

    # Get the borrower from the request
    borrowernum = request.args.get('borrower')
    if borrowernum is None:
        return result(410, 'Missing borrower')

    cursor = get_cursor()

    # Ensure the item exists.
    cursor.execute(
        """SELECT * FROM items WHERE barcode = %s;""", (barcode,)
        )
    item = cursor.fetchone()
    if item is None:
        return result(411, 'Unknown barcode', {'barcode': barcode})

    # Ensure the borrower exists.
    cursor.execute(
        """SELECT * FROM borrowers WHERE borrowernumber = %s;""",
        (borrowernum,)
        )
    borrower = cursor.fetchone()
    if borrower is None:
        return result(412, 'Unknown borrower', {'borrowernum': borrowernum})

    # If the item is already checked out, check it in automatically.
    cursor.execute("""SELECT * FROM `out` WHERE barcode = %s""", (barcode,))
    out_item = cursor.fetchone()
    if out_item is not None:
        checkin_item()

    # Check out the item
    cursor.execute(
        """
        INSERT INTO `out` (barcode, borrowernumber, checkout_date, date_due)
        VALUES (%s, %s, %s, %s)
        """,
        (barcode, borrowernum, datetime.date.today(),
         datetime.date.today()+datetime.timedelta(days=CHECKOUT_DURATION))
        )

    cursor.execute(
        """
        INSERT INTO issue_history (barcode, borrowernumber, checkout_date,
                                   date_due)
        VALUES (%s, %s, %s, %s)
        """,
        (barcode, borrowernum, datetime.date.today(),
         datetime.date.today()+datetime.timedelta(days=CHECKOUT_DURATION))
        )

    # The item was successfully checked out.
    return result(
        200, 'Success',
        {'barcode': barcode, 'borrower': borrowernum})


@app.route('/checkin', methods=['GET', 'POST'])
def checkin_item():
    """Check-in an item.

    Parameters: barcode [string]
    Output: Status of the checkin.
    """
    # Get the barcode from the request
    barcode = request.args.get('barcode')
    if barcode is None:
        return result(410, 'Missing barcode')

    cursor = get_cursor()

    # Check that the barcode exists.
    cursor.execute("SELECT * FROM items WHERE barcode = %s", (barcode,))
    item = cursor.fetchone()
    if item is None:
        return result(411, 'Unknown barcode', {'barcode': barcode})

    # Is the item checked out? If not return error code.
    cursor.execute('SELECT * FROM `out` WHERE barcode = %s', (barcode,))

    out_item = cursor.fetchone()
    if out_item is None:
        return result(420, 'Item not checked out', {'barcode': barcode})

    # If necessary, make a late fee entry.
    if out_item['fine_due'] != None and out_item['fine_paid'] == 0:
        cursor.execute(
            """
            INSERT INTO latefee (
                borrowernumber,
                barcode,
                checkout_date,
                date_due,
                returndate,
                renewals,
                fine_due,
                fine_paid)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (out_item['borrowernumber'], out_item['barcode'],
             out_item['checkout_date'], out_item['date_due'],
             datetime.date.today(), out_item['renewals'],
             out_item['fine_due'], out_item['fine_paid'])
        )

    # Check in the item and move to history.
    cursor.execute("""
        INSERT INTO issue_history(
            borrowernumber,
            barcode,
            checkout_date,
            date_due,
            returndate,
            renewals,
            fine_due,
            fine_paid)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        """,
        (out_item['borrowernumber'], out_item['barcode'],
         out_item['checkout_date'], out_item['date_due'],
         datetime.date.today(), out_item['renewals'],
         out_item['fine_due'], out_item['fine_paid'])
        )
    cursor.execute("DELETE FROM `out` WHERE barcode = %s;", (barcode,));

    # The item was successfully checked in.
    return result(200, 'Success', {'barcode': barcode})
