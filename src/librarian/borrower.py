##############################################################################
#
# Copyright (c) 2014 German Saturday School Boston
# All Rights Reserved.
#
##############################################################################
"""Borrower REST Views"""
import datetime
from flask import jsonify, request

from librarian import json
from librarian.app import app, log, get_cursor, result

BORROWER_FIELDS = (('borrowernumber', None, int),
                   ('cardnumber', None, unicode),
                   ('surname', None, unicode),
                   ('firstname', None, unicode),
                   ('streetaddress', None, unicode),
                   ('city', None, unicode),
                   ('zipcode', None, unicode),
                   ('phone', None, unicode),
                   ('emailaddress', None, unicode),
                   ('emailaddress_2', None, unicode),
                   ('contactname', None, unicode),
                   ('debarred', None, int))

@app.route('/borrowers', methods=['GET'])
def get_borrowers():
    """Get a list of all borrowers"""
    cursor = get_cursor()
    cursor.execute('SELECT * FROM borrowers;')
    return result(200, 'Ok', {'result': cursor.fetchall()})

@app.route('/borrowers/<borrower>', methods=['GET'])
def get_borrower(borrower):
    """Get a borrower."""
    cursor = get_cursor()
    cursor.execute('SELECT * FROM borrowers where id = %s;', (int(borrower),))
    return result(200, 'Ok', {'result': cursor.fetchone()})

@app.route('/borrowers/new', methods=['GET', 'POST'])
def add_borrower():
    """Add a borrower."""
    data = {}
    for field_name, default, type in BORROWER_FIELDS:
        value = request.args.get(field_name)
        value = type(value) if value is not None else default
        data[field_name] = value

    cursor = get_cursor()
    cursor.execute(
        """
        INSERT INTO borrowers (
            borrowernumber,
            cardnumber,
            surname,
            firstname,
            streetaddress,
            city,
            zipcode,
            phone,
            emailaddress,
            emailaddress_2,
            contactname,
            debarred)
        VALUES (
            %(borrowernumber)s,
            %(cardnumber)s,
            %(surname)s,
            %(firstname)s,
            %(streetaddress)s,
            %(city)s,
            %(zipcode)s,
            %(phone)s,
            %(emailaddress)s,
            %(emailaddress_2)s,
            %(contactname)s,
            %(debarred)s
            );
        """, data)
    cursor.execute('SELECT LAST_INSERT_ID() as id;')
    return result(200, 'Ok', {'result': cursor.fetchone()})


@app.route('/borrowers/<borrower>', methods=['POST'])
@app.route('/borrowers/<borrower>/edit', methods=['GET', 'POST'])
def edit_borrower(borrower):
    """Edit a borrower."""
    data = {}
    for field_name, default, type in BORROWER_FIELDS:
        if field_name in request.args:
            data[field_name] = type(request.args[field_name])
    data['id'] = int(borrower)
    cursor = get_cursor()
    cursor.execute(
        """
        UPDATE borrowers
        SET
          %s
        WHERE id = %%(id)s
        """ %', '.join(['%s = %%(%s)s' %(n, n) for n in data if n != 'id']),
        data)
    return result(200, 'Ok', {'result': {'id': int(borrower)}})
