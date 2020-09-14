#!/usr/bin/env python
#
# Script for inserting/updating families from a CSV file to the borrowers table.
#

import sys
import csv
import dbtools
import argparse

#Column names in the Source CSV file.
SRC_SYCAMORE_ID      = "Family Code"
SRC_CHILD_FIRST_NAME = "First Name"
SRC_CHILD_EMAIL      = "Student Email"
SRC_LAST_NAME        = "Last Name"
SRC_FAMILY_EMAILS    = "Family Email"
SRC_FAMILY_NAME      = "Family Name"
SRC_PHONE            = "Cell Phone"

DBCOL_BORROWER_ID="id"
DBCOL_BORROWER_NUMBER="borrowernumber"
DBCOL_BORROWER_STATE="state"
DBCOL_BORROWER_SYCAMODE_ID="sycamoreid"
DBCOL_BORROWER_CONTACTNAME="contactname"
DBCOL_BORROWER_FIRSTNAME="firstname"
DBCOL_BORROWER_SURNAME="surname"
DBCOL_BORROWER_PHONE="phone"
DBCOL_BORROWER_EMAIL="emailaddress"

def _csv_row_to_borrower(row, borrower_dict):
    
    """
    Converts a row (given as a dict) to a borrower dictionary.
    """
    borrower = {}

    SID = row[SRC_SYCAMORE_ID].strip()
    assert(len(SID)==7)
    
    borrower[DBCOL_BORROWER_SYCAMODE_ID] = SID 

    borrower[DBCOL_BORROWER_CONTACTNAME] = row[SRC_FAMILY_NAME] 

    borrower[DBCOL_BORROWER_FIRSTNAME] = row[SRC_CHILD_FIRST_NAME]
    
    borrower[DBCOL_BORROWER_SURNAME] = row[SRC_LAST_NAME]

    # There may be three phone number columns in the CSV file for home, work,
    # and cell phone. Each of these columns may contain multiple phone numbers
    # separated by a pipe. We only take the first home phone number.
    borrower[DBCOL_BORROWER_PHONE] = row[SRC_PHONE].split('|')[0].strip()

    # The email address are separated by a pipe in the CSV Email column and by a
    # comma in the database column.
    borrower[DBCOL_BORROWER_EMAIL] = ', '.join([x.strip() for x in row[SRC_FAMILY_EMAILS].split('|')])
    

    if SID not in borrower_dict:
        borrower_dict[SID]=borrower
    else:
        #only update the dict with additional data.
        #csv sanity check. These columns should be the same for everyone with the same sycamore ID
        for item in [DBCOL_BORROWER_CONTACTNAME, DBCOL_BORROWER_EMAIL]:
            if borrower_dict[SID][item]!=borrower[item]:
                raise ValueError(f"Found conflicting data on column {item} for borrower with ID {SID}")
      
        borrower_dict[SID][DBCOL_BORROWER_FIRSTNAME]+=("," + borrower[DBCOL_BORROWER_FIRSTNAME])


    return borrower

def _get_borrowers(csv_filename):
    """
    Reads the CSV file and returns the parsed borrower rows as a list
    of Borrower objects.
    """
    #indexed by sycamore ID:
    borrower_dict = {}
    with open(csv_filename) as csvFile:
        reader = csv.DictReader(csvFile)
        for row in reader:
            _csv_row_to_borrower(row, borrower_dict)
    
    for __, borrower in borrower_dict.items():

      #clean up the comma-separated list of childrens names so it follows the
      #"a and b" or "a, b and c" pattern
      clist=[cn.strip() for cn in borrower[DBCOL_BORROWER_FIRSTNAME].split(",")]
      if len(clist) >= 2:
        borrower[DBCOL_BORROWER_FIRSTNAME]=", ".join(clist[:-1]) + " and " + clist[-1]
      elif len(clist)==1:
        borrower[DBCOL_BORROWER_FIRSTNAME]=clist[0]
      else:
        raise ValueError("firstnames array was of size 0")
        
    return borrower_dict

def get_new_borrower_number(cursor):
  #find the max and add one...
  cursor.execute("SELECT MAX(" + DBCOL_BORROWER_NUMBER + ")+1 as new_borrower_number from borrowers")
  return cursor.fetchone()["new_borrower_number"]


def update_or_create_borrower(cursor, borrower):

    #keys to identify the record:
    id_dict = { k: borrower[k] for k in [DBCOL_BORROWER_SYCAMODE_ID] }

    #which rows to update or insert:
    update_dict = { k: borrower[k] for k in [ DBCOL_BORROWER_FIRSTNAME,
                                            DBCOL_BORROWER_CONTACTNAME,
                                            DBCOL_BORROWER_SURNAME,
                                            DBCOL_BORROWER_EMAIL,
                                            DBCOL_BORROWER_PHONE ]}

    #which rows to only define if a new item is being inserted:
    create_dict = { DBCOL_BORROWER_NUMBER: get_new_borrower_number(cursor) }

    #actually do it.
    return dbtools.update_or_create( cursor=cursor,
                              table="borrowers",
                              id_dict=id_dict,
                              update_dict=update_dict,
                              create_only_dict=create_dict)


if __name__ == '__main__':

    parser = argparse.ArgumentParser(parents = [dbtools.getArgParser()], conflict_handler='resolve')
    parser.add_argument('-i', '--input', required=True, dest='input', help='CSV Input Filename.')
    parsed_args = parser.parse_args()

    conn = dbtools.init_connection(parsed_args)
    cursor = conn.cursor()

    created=0
    updated=0

    for borrower in _get_borrowers(parsed_args.input).values():
        if update_or_create_borrower(cursor, borrower):
          created+=1
        else:
          updated+=1

    conn.commit()

    print(f"All Done. Created {created} new borrowers and updated {updated} existing ones.")
