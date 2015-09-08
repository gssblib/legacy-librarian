#!/usr/bin/python
#
# Script for uploading families from a CSV file to the borrowers table.
#
# In the end, it was easier to implement this script in node and add the
# new borrowers by calling the function in the library module used by the
# server. This function generates the borrower ids, for example, and thus
# makes sure that the new borrower is consistent with borrowers added in
# the UI. However, the parsing and transformation is simpler is this
# Python implementation.
#

import json # for the server config
import sys
import csv

def _getConfig(env):
    """
    Returns the server configuration as a dictionary.

    The server config uses JSON with comments. Since we only use full-line
    comments, we can filter them out by looking at // at the beginning of
    a line.
    """
    def isComment(line):
        return line.strip().startswith('//')

    configFilename = 'config/%s.json' % env
    configFile = open(configFilename)
    config = "".join([
        line for line in configFile.readlines() if not isComment(line)])
    return json.loads(config)

def _csvRowToBorrower(row):
    """
    Converts a row (given as a list) to a borrower dictionary.
    """
    borrower = {}

    # The borrower name is contained in a single field containing the last name,
    # a comma, and the first names of the parents separated by an ampersand.
    # In the database we store the name of the parents in the 'contactname'
    # field containing the first names followed by the last name.
    name = row[1].split(', ')
    borrower["contactname"] = name[1].replace('&', 'and') + ' ' + name[0]

    borrower['streetaddress'] = row[2]
    borrower['city'] = row[3].strip()

    # The leading zero is missing from the (New England) zip codes.
    borrower['zipcode'] = "%05d" % int(row[4])

    # There may be three phone number columns in the CSV file for home, work,
    # and cell phone. Each of these columns may contain multiple phone numbers
    # separated by a pipe. We only take the first home phone number.
    borrower['phone'] = row[5].split('|')[0].strip()

    # The email address are separated by a pipe in the CSV Email column and by a
    # comma in the database column.
    borrower['emailaddress'] = row[8].replace(' | ', ', ')

    # Up to five students a provided in each CSV row with three columns (last name,
    # first name, grade) for each student. In the library database, we have one
    # column ('surname') for the last name of all students (that is, the students
    # of a borrower cannot have different last names) and one column ('firstname')
    # for all the first names of the students (separated by a comma or 'and').
    offset = 10
    borrower['surname'] = row[offset]
    borrower['firstname'] = ", ".join(
        [name for name in [row[3*i + offset + 1] for i in range(5)] if name])

    return borrower

def _getBorrowers(csvFilename):
    """
    Reads the CSV file and returns the parsed borrower rows as a list
    of Borrower objects.
    """
    borrowers = []
    with open(csvFilename) as csvFile:
        reader = csv.reader(csvFile)
        # skip head line
        reader.next()
        for row in reader:
            borrowers.append(_csvRowToBorrower(row))
    return borrowers

if __name__ == '__main__':
    env = sys.argv[1]
    csvFilename = sys.argv[2]

    print _getConfig(env)
    for borrower in _getBorrowers(csvFilename):
        print borrower

