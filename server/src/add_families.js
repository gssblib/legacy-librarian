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
      toArray = require('stream-to-array'),
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
 * There must be something in the stream API to do that, but I couldn't
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

/**
 * Returns the borrower object for the row from the CSV input file.
 *
 * The row contains:
 *   0. FamilyID              example: SIM1234
 *   1. FirstName             example: Bart
 *   2. LastName              example: Simpson
 *   3. ParentName            example: "Simpson, Homer & Marge"
 *   4. ParentName2           example: "Homer & Marge Simpson"
 *   5. ParentLastName        example: Simpson (often empty in the data)
 *   6. PrimaryParentEmail    example: homer.simpson@example.com
 *   7. SecondaryParentEmail
 *   8. TertiaryParentEmail
 */
function csvFamilyToBorrower(row) {
  const data = row.map(val => val.trim());
  return {
    sycamoreid: data[0],
    firstname: data[1],
    surname: data[2],
    contactname: data[4],
    emailaddress: data[6]
  };
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
 * Merges borrowers with the same family id.
 */
function mergeFamilies(borrowers) {
  const families = new Map();
  for (const borrower of borrowers) {
    const oldFamily = families.get(borrower.sycamoreid);
    if (oldFamily) {
      oldFamily.firstname += " and " + borrower.firstname;
    } else {
      families.set(borrower.sycamoreid, borrower);
    }
  }
  return Array.from(families.values());
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

  toArray(parseFamiliesCsvFile(filename))
    .then(mergeFamilies)
    .then(borrowers => {
      for (const borrower of borrowers) {
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
      }
    })
    .finally(ref.dec);
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
  toArray(parseFamiliesCsvFile(filename))
    .then(mergeFamilies)
    .then(borrowers => console.log(borrowers));
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
