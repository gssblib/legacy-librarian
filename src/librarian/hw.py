"""Web UI for the library."""
import os
import logging
from flask import Flask, render_template, request, Markup
import requests

app = Flask('librarian')
log = logging.getLogger('librarian')

DEBUG = False

@app.route('/', methods=['GET', 'POST'])
def index():
    """The password change form"""
    error = result = message = None
    return render_template('index.html', name=u'Stephan')

def main():
    app.run(debug=DEBUG)


if __name__ == '__main__':
    main()
