##############################################################################
#
# Copyright (c) 2014 German Saturday School Boston
# All Rights Reserved.
#
##############################################################################
"""Application Setup"""
import os
import logging
import MySQLdb
from flask import Flask, jsonify
from flaskext.mysql import MySQL

app = Flask('librarian')
log = logging.getLogger('librarian')

DEBUG = True

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'root'
app.config['MYSQL_DATABASE_DB'] = 'spils'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql = MySQL()
mysql.init_app(app)

def get_cursor():
    db = mysql.get_db()
    return db.cursor(MySQLdb.cursors.DictCursor)

# XXX: This is *not* done by flaskext.mysql!
@app.after_request
def commit_db(response):
    mysql.get_db().commit()
    return response

def result(code, msg, data=None):
    res = {
        'status': code,
        'status_msg': msg}
    if data is not None:
        res.update(data)
    return jsonify(res)

def main():
    # Load modules, so that their routes get registered. A bit lame.
    from librarian import item
    app.run(debug=DEBUG)

if __name__ == '__main__':
    main()
