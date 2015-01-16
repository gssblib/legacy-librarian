/**
 * Service module for the GSSB library database.
 */
const Q = require('q'),
      merge = require('merge'),
      entity = require('./entity');

module.exports = {
  /**
   * Factory function creating a new GSSB library service object.
   *
   * @param db mysql-promise database object
   * @param config optional configuration with borrowDays and renewalDays
   * @return library service with entities borrowers, items, checkouts, and history
   */
  create: function (db, config) {
    config = merge({ borrowDays: 21, renewalDays: 21 }, config);

    // borrowers table/entity
    var borrowers = entity(db, {
      name: 'borrowers',
      columns: [
        'borrowernumber', 'cardnumber', 'firstname', 'contactname',
        {name: 'surname', queryOp: 'contains'},
        'streetaddress', 'city', 'zipcode', 'phone', 'emailaddress', 'emailaddress_2'],
      naturalKey: 'borrowernumber'});

    /**
     * Override the 'create' method to first compute the next borrowernumber
     * and cardnumber.
     */
    borrowers.create = function (obj) {
      var self = this;
      return db.selectRow(
          'select max(borrowernumber) as max_borrowernumber from borrowers')
        .then(function (data) {
          obj.borrowernumber = 1 + data.max_borrowernumber;
          obj.cardnumber = 100000000 + obj.borrowernumber;
          return borrowers.constructor.prototype.create.call(self, obj);
        });
    };

    /**
     * Returns promise of checkout records joined with the associated item
     * information. The table is either the checkouts table 'out' or the history
     * table 'issue_history'. If feesOnly is true, only records with outstanding
     * fees will be returned.
     */
    function getCheckouts(table, borrowerNumber, feesOnly) {
      var sql = 'select a.*, b.* from items a ' +
        'inner join ' + table + ' b on a.barcode = b.barcode ' +
        'where b.borrowernumber = ?';
      if (feesOnly) {
        sql += ' and b.fine_due > b.fine_paid';
      }
      return db.selectRows(sql, borrowerNumber);
    }

    borrowers.checkouts = function (borrowerNumber, feesOnly) {
      return getCheckouts('`out`', borrowerNumber, feesOnly);
    }

    borrowers.history = function (borrowerNumber, feesOnly) {
      return getCheckouts('issue_history', borrowerNumber, feesOnly);
    }

    /**
     * Returns the total amount due for the given items.
     */
    function totalFine(items) {
      return items.reduce(function (total, item) {
        return total + item.fine_due - item.fine_paid;
      }, 0); 
    }

    /**
     * Returns promise of the fees a borrower has to pay with the associated
     * items (currently checked out or already returned).
     */
    borrowers.fees = function (borrowerNumber) {
      var self = this;
      var result = {};
      return Q.all([
          self.checkouts(borrowerNumber, true),
          self.history(borrowerNumber, true)]).then(function (data) {
        return {
          total: totalFine(data[0]) + totalFine(data[1]),
          items: data[0],
          history: data[1]
        };
      });
    };

    /**
     * Override the borrowers' get method to optionally fetch the checked out
     * items, history, and fees.
     */
    borrowers.get = function (borrowernumber, options) {
      var self = this;
      options = options || {};
      return self.constructor.prototype.get.call(self, borrowernumber).then(
        function (borrower) {
          var extras = [];
          if (options.items) {
            extras.push(self.checkouts(borrowernumber)
              .then(function (items) { borrower.items = items; }));
          }
          if (options.history) {
            extras.push(self.history(borrowernumber)
              .then(function (history) { borrower.history = history; }));
          }
          if (options.fees) {
            extras.push(self.fees(borrowernumber)
              .then(function (fees) { borrower.fees = fees; }));
          }
          return Q.all(extras).then(function () { return borrower; });
        });
    };

    /**
     * Pays all outstanding fees of a borrower.
     */
    borrowers.payFees = function (borrowerNumber) {
      return borrowers.get(borrowerNumber).then(function (borrower) {
        return Q.all([
          db.query(
            'update `out` set fine_paid = fine_due ' +
            'where fine_due > fine_paid and borrowernumber = ?',
            borrowerNumber),
          db.query(
            'update issue_history set fine_paid = fine_due ' +
            'where fine_due > fine_paid and borrowernumber = ?',
            borrowerNumber)]);
      });
    }

    /**
     * Returns promise of the list of borrowers with fees due.
     */
    borrowers.allFees = function () {
      function feeQuery(table) {
        return 'select * from (' +
          'select a.borrowernumber, a.surname, a.contactname, a.firstname, ' +
          'sum(if(b.fine_paid > b.fine_due, 0, b.fine_due - b.fine_paid)) as fee ' +
          'from borrowers a join ' + table + ' b on a.borrowernumber = b.borrowernumber ' +
          'group by a.borrowernumber) fees where fee > 0';
      }
      return Q.all([db.selectRows(feeQuery('`out`')),
                    db.selectRows(feeQuery('issue_history'))])
        .then(function (data) {
          var borrowers = {};
          data[0].forEach(function (borrower) {
            borrower.newFee = borrower.fee;
            borrower.oldFee = 0;
            borrowers[borrower.borrowernumber] = borrower;
          });
          data[1].forEach(function (borrower) {
            borrower.oldFee = borrower.fee;
            borrower.newFee = 0;
            if (borrowers[borrower.borrowernumber] === undefined) {
              borrowers[borrower.borrowernumber] = borrower;
            } else {
              borrowers[borrower.borrowernumber].fee += borrower.fee;
              borrowers[borrower.borrowernumber].oldFee = borrower.fee;
            }
          });
          return Object.keys(borrowers).map(function (key) { return borrowers[key]; });
        });
    };

    // items table/entity
    var items = entity(db, {
      name: 'items',
      columns: [
        'barcode', 'description', 'subject', 'added', 'itemlost',
        {name: 'title', queryOp: 'contains'},
        {name: 'author', queryOp: 'contains'},
        'publicationyear', 'publishercode', 'age', 'media', 'serial', 'seriestitle',
        'classification', 'country', 'itemnotes', 'replacementprice', 'issues'],
      naturalKey: 'barcode'});

    var checkoutColumns = [
      'borrowernumber', 'barcode', 'checkout_date', 'date_due',
      'returndate', 'renewals', 'fine_due', 'fine_paid'];

    // `out` table containing the current checkouts
    var checkouts = entity(db, {
        name: 'checkouts',
        tableName: 'out',
        columns: checkoutColumns,
        naturalKey: 'barcode'});

    checkouts.updateFees = function (date) {
      return db.query('update `out` set fine_due = if(date_due < ?, 0.5, 0)', date);
    };

    checkouts.payFee = function (barcode) {
      return db.query('update `out` set fine_paid = fine_due where barcode = ?', barcode);
    };

    // `issue_history` table containing the checkout copies for returned items
    var history = entity(db, {
        name: 'history',
        tableName: 'issue_history',
        columns: checkoutColumns});

    history.payFee = function (id) {
      return db.query('update issue_history set fine_paid = fine_due where id = ?', id);
    }

    /**
     * Returns the promise of an item together with its checkout information.
     * Throws an error if the item does not exist.
     */
    items.get = function (barcode) {
      var self = this;
      var result;
      return items.constructor.prototype.get.call(self, barcode)
        .then(function (item) {
          result = item;
          return checkouts.find(barcode);
        })
        .then(function (checkout) {
          if (checkout) {
            result.checkout = checkout;
            return borrowers.get(checkout.borrowernumber).then(function (borrower) {
              result.borrower = borrower;
              return result;
            });
          } else {
            return result;
          }
        });
    };

    /**
     * Returns promise to result containing item and checkout.
     *
     * Throws an error if the item does not exist or is not checked out,
     */
    function getCheckedOutItem(barcode) {
      return items.get(barcode).then(function (data) {
        if (!data.checkout) {
          throw {httpStatusCode: 400, code: 'ITEM_NOT_CHECKED_OUT', errno: 1101};
        }
        return data;
      });
    }

    /**
     * Returns promise of returning an item. The returned object contains the
     * borrower, item, and checkout.
     */
    items.checkin = function (barcode) {
      var result;
      var checkoutId;
      return getCheckedOutItem(barcode)
        .then(function (data) {
          result = data;
          var checkout = data.checkout;
          checkoutId = checkout.id;
          checkout.returndate = new Date();
          return history.create(checkout);
        })
        .then(function (data) {
          return checkouts.remove(checkoutId);
        })
        .then(function () { return result; });
    };

    /**
     * Returns the given date plus the days as a new date.
     */
    function addDays(date, days) {
      var newDate = new Date(date);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    }

    /**
     * Returns the promise of renewing an item. The returned object contains
     * item, updated checkout, and borrower.
     */
    items.renew = function (barcode) {
      var result;
      return getCheckedOutItem(barcode).then(function (data) {
        result = data;
        var checkout = data.checkout;
        checkout.date_due = addDays(checkout.date_due, config.renewalDays);
        return checkouts.update({id: checkout.id, date_due: checkout.date_due});
      }).then(function () { return result; });
    };

    /**
     * Returns the promise of checking out an item. The result contains
     * the item, checkout, and borrower.
     */
    items.checkout = function (barcode, params) {
      var borrowerNumber = params.borrower;
      var result = {};
      return borrowers.get(borrowerNumber)
        .then(function (borrower) {
          result.borrower = borrower;
          return items.get(barcode);
        })
        .then(function (data) {
          if (data.checkout) {
            throw {
              httpStatusCode: 400, code: 'ITEM_ALREADY_CHECKED_OUT', errno: 1105,
              checkout: data.checkout
            };
          }
          result.item = data.item;
          return null;
        })
        .then(function () {
          return checkouts.create({
            borrowernumber: borrowerNumber,
            barcode: barcode,
            checkout_date: new Date(),
            date_due: addDays(new Date(), config.borrowDays),
            returndate: null,
            renewals: 0,
            fine_due: 0,
            fine_paid: 0
          });
        })
        .then(function () { return checkouts.get(barcode); })
        .then(function (checkout) {
          result.checkout = checkout;
          return result;
        });
    }

    return {
      borrowers: borrowers,
      items: items,
      checkouts: checkouts,
      history: history
    };
  }
};

