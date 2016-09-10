#!/usr/bin/env node
/**
 * Script for importing borrowers from a CSV "family" file.
 *
 * Usage:
 *   add_families.js (show|insert) <csv-filename>
 *
 * This script parses the given CSV file, converts each row to a borrower,
 * and inserts the borrowers into the 'borrowers' table.
 *
 * See the csvFamilyToBorrower function below for the format of the rows
 * in the CSV file.
 */
const fs = require('fs'),
      util = require('util'),
      // We need sprintf for %05d which is not supported by util.format.
      sprintf = require('sprintf-js').sprintf,
      stream = require('stream'),
      Transform = stream.Transform,
      csv = require('csv'),

      // modules for the database and library
      mysqlq = require('../lib/mysqlq'),
      config = require('config'),
      db = mysqlq(require('mysql').createPool(config.get('db'))),
      library = require('./library').create(db);

/**
 * Transform that drops the first n objects of the stream (like Scala's drop).
 *
 * There must must be something in the stream API to do that, but I couldn't
 * find it, and this may at least serve as a small example of a Transform.
 */
function Drop(n) {
  Transform.call(this, {objectMode: true});
  this._n = n;
  this._index = 0;
}

util.inherits(Drop, Transform);
Drop.prototype._transform = function (data, encoding, done) {
  if (++this._index > this._n) {
    this.push(data);
  }
  done();
}

function csvFamilyToBorrower(row) {
  var borrower = {};

  // The borrower name is contained in a single field containing the last name,
  // a comma, and the first names of the parents separated by an ampersand.
  // In the database we store the name of the parents in the 'contactname'
  // field containing the first names followed by the last name.
  var name = row[0].split(', ');
  borrower.contactname = name[1].replace(/&/g, 'and').trim() + ' ' + name[0];

  borrower.streetaddress = row[1];
  borrower.city = row[2];

  // The leading zero is missing from the (New England) zip codes in the CSV file
  // (they must be numbers in the spreadsheet).
  borrower.zipcode = '00000' // sprintf("%05d", Number(row[3]))

  // There may be three phone number columns in the CSV file for home, work,
  // and cell phone. Each of these columns may contain multiple phone numbers
  // separated by a pipe. We only take the first home phone number.
  borrower.phone = row[4].split('|')[0].trim()

  // The email address are separated by a pipe in the CSV Email column and by a
  // comma in the database column.
  borrower.emailaddress = row[7].replace(/ \| /g, ', ')

  // Up to five students a provided in each CSV row with three columns (last name,
  // first name, grade) for each student. In the library database, we have one
  // column ('surname') for the last name of all students (that is, the students
  // of a borrower cannot have different last names) and one column ('firstname')
  // for all the first names of the students (separated by a comma or 'and').
  offset = 8
  borrower.surname = row[offset]
  var firstNames = []
  for (var i = 0; i < 5; ++i) {
    var firstName = row[offset + 3*i + 1];
    if (firstName) {
      firstNames.push(firstName);
    }
  }
  borrower.firstname = firstNames.join(', ');
  return borrower;
}

/**
 * Returns the stream of borrowers read from the CSV file.
 *
 * Each row is parsed and converted to a borrower object as needed for the
 * borrowers table.
 */
function parseFamiliesCsvFile(filename) {
  console.log('parsing file: ', filename);
  return fs.createReadStream(filename)
      .pipe(csv.parse({}))
      .pipe(new Drop(1)) // skip header row
      .pipe(csv.transform(csvFamilyToBorrower));
}

/**
 * Returns the promise of the next available borrower number.
 */
function nextBorrowerNumber() {
  return db.selectRow(
      'select max(borrowernumber) as max_borrowernumber from borrowers')
    .then(function (data) {
      return data.max_borrowernumber + 1;
    });
}

/**
 * A reference counter that calls the 'done' callback when reaching
 * zero in the 'dec' method.
 *
 * This is used below to make sure that the database connection pool
 * is closed once all database operation are complete.
 */
function refcount(done) {
  var count = 0;
  return {
    inc: function () { ++count; },
    dec: function () {
      if (--count === 0) {
        done();
      }
    }
  };
}

/**
 * Parses the CSV file and inserts the borrowers, assigning borrower numbers
 * starting with the given one.
 *
 * The only tricky part is the lifecycle of the connection pool using the
 * reference counter 'ref' to make sure that the connection pool is closed
 * when the script is done but not before all records have been processed.
 */
function parseAndInsertBorrowers(filename, borrowernumber, ref) {
  // Make sure the connection pool is not closed prematurely before all
  // records have been processed.
  ref.inc();

  parseFamiliesCsvFile(filename)
    .on('data', function(borrower) {
      ref.inc();
      borrower.borrowernumber = borrowernumber++;
      library.borrowers.create(borrower)
        .then(function (borrower) {
          console.log('inserted borrower: ', borrower.contactname);
        })
        .catch(function (error) {
          console.log('failed to insert borrower: ', borrower, ' ', error);
        })
        .fin(ref.dec);
    })
    // All records have been parsed and the insertion tasks started.
    .on('end', ref.dec);
}

/**
 * Determines the next borrower number and inserts the borrowers read from
 * the file.
 */
function insertBorrowers(filename) {
  var ref = refcount(function() { db.pool.end(); });
  nextBorrowerNumber()
    .then(function (borrowernumber) {
      parseAndInsertBorrowers(filename, borrowernumber, ref);
    })
    .done();
}

/**
 * Shows all the parsed borrowers in the file.
 */
function showBorrowers(filename) {
  parseFamiliesCsvFile(filename)
    .on('data', function(borrower) {
      console.log(borrower);
    });
}

function main() {
  var args = process.argv.slice(2);
  var command = args[0];
  var filename = args[1];
  if (command === 'show') {
    showBorrowers(filename);
  } else if (command === 'insert') {
    insertBorrowers(filename);
  }
}

main()
