##############################################################################
#
# Copyright (c) 2014 German Saturday School Boston
# All Rights Reserved.
#
##############################################################################
"""Checkout REST Views"""
from flask import jsonify, request

from librarian import app

@app.app.route(app.API_PREFIX+'/checkouts', methods=['GET'])
def get_checkouts():
    """Get a list of all borrowers"""
    query, qargs = 'SELECT * FROM `out`', ()

    borrowernumber = request.args.get('borrower')
    if borrowernumber:
        query += ' WHERE borrowernumber = %s'
        qargs += (int(borrowernumber),)

    query, qargs = app.add_limit_params(request, query, qargs)

    cursor = app.get_cursor()
    cursor.execute(query, qargs)
    return app.result(200, 'Ok', {'result': cursor.fetchall()})
