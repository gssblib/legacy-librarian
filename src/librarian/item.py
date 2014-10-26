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

@app.route('/items', methods=['GET'])
def get_items():
    """Get a list of all items"""
    cursor = get_cursor()
    cursor.execute('SELECT * FROM items;')
    fields = [f[0] for f in cursor.description]
    return jsonify({
        'status': 200,
        'status_msg': 'Ok',
        'result': [dict(zip(fields, row)) for row in cursor.fetchall()]
        })


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
