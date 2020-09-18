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
   * If provided, the 'time' object must have a function 'now' that returns
   * the current time as a JavaScript Date object.
   *
   * Configuration parameters:
   *
   *   borrowDays: initial borrowing period, dueDate = checkoutDate + borrowDays
   *   renewalDays: number of days added when renewing an item, dueDate = now + renewalDays
   *   renewalLimitDays: checkoutDay > now - renewalDays <=> renewal allowed
   *
   * The normal defaults are 21, 21, and 30. We switched to 28, 28, 0 (no renewals)
   * during the online-only check-out.
   *
   * @param db mysql-promise database object
   * @param config optional configuration
   * @param time optional time source that can be used to override time functions
   * @return library service with entities borrowers, items, checkouts, and history
   */
  create: function (db, config, time) {
    config = merge({ borrowDays: 28, renewalDays: 28, renewalLimitDays: 0 }, config);
    time = time || { now: function() { return new Date(); }};

    // custom column domains used for the library entities.
    const domains = {}

    function addDomain(domain) {
      domains[domain.name] = domain;
    }

    addDomain({
      name: 'Barcode',
      type: 'string',
      validation: { pattern: '\\d{9}', minLength: 9, maxLength: 9}
    });
    addDomain({
      name: 'ItemState',
      type: 'enum',
      options: ['CIRCULATING', 'STORED', 'DELETED', 'LOST', 'IN_REPAIR']
    });
    addDomain({
      name: 'ItemDescription',
      type: 'enum',
      options: [
        "Buch",
        "CD",
        "DVD",
        "Comic",
        "Multimedia",
        "Zeitschrift",
      ]
    });
    addDomain({
      name: 'ItemSubject',
      type: 'enum',
      options: [
        "CD",
        "CD-ROM",
        "DVD",
        "Zeitschrift",
        "Bilderbuch B - gelb",
        "Comic C - orange",
        "Erzaehlung E - dunkelgruen",
        "Leseleiter LL - klar",
        "Maerchen Mae - rot",
        "Multimedia MM - rosa",
        "Sachkunde S - blau",
        "Sachkunde Serie - hellblau",
        "Teen T - hellgruen",
        "Uebergroesse - lila",
        "Fasching",
        "Halloween",
        "Ostern",
        "St. Martin",
        "Weihnachten"
      ]
    });
    addDomain({
      name: 'ItemAge',
      type: 'enum',
      options: [
        "All Ages",
        "K-1",
        "K-2",
        "T-12",
        "T-17",
        "Leseleiter-1A",
        "Leseleiter-1B",
        "Leseleiter-1C",
        "Leseleiter-2",
        "Leseleiter-3",
        "Leseleiter-4",
        "Leseleiter-5",
        "Leseleiter-6",
        "Leseleiter-7",
        "Leseleiter-8",
        "Leseleiter-9",
        "Leseleiter-10"
      ]
    });
    addDomain({
      name: 'BorrowerState',
      type: 'enum',
      options: ['ACTIVE', 'INACTIVE']
    });

    // borrowers table/entity
    var borrowers = entity(db, {
      name: 'borrowers',
      columns: [
        {name: 'borrowernumber', label: 'Borrower Number',
         internal: true, domain: entity.domains.Integer},
        {name: 'surname', required: true, label: 'Last Name', queryOp: 'contains'},
        {name: 'firstname', label: 'First Name', queryOp: 'contains'},
        {name: 'contactname', label: 'Contact Name', queryOp: 'contains'},
        {name: 'phone', label: 'Phone Number'},
        {name: 'emailaddress', required: true, label: 'E-mail',
         queryOp: 'contains'},
        {name: 'sycamoreid', label: 'Sycamore ID'},
        {name: 'state', required: true, domain: domains.BorrowerState}
      ],
      naturalKey: 'borrowernumber'});

    /**
     * Override the 'create' method to first compute the next borrowernumber
     * and cardnumber if not provided.
     */
    borrowers.create = function (obj) {
      var self = this;
      if (obj.borrowernumber) {
        if (!obj.cardnumber) {
          obj.cardnumber = 100000000 + obj.borrowernumber;
        }
        return borrowers.constructor.prototype.create.call(self, obj);
      } else {
        return db.selectRow(
            'select max(borrowernumber) as max_borrowernumber from borrowers')
          .then(function (data) {
            obj.borrowernumber = 1 + data.max_borrowernumber;
            obj.cardnumber = 100000000 + obj.borrowernumber;
            return borrowers.constructor.prototype.create.call(self, obj);
          });
      }
    };

    /**
     * Sets the renewable flag in the 'checkout'.
     */
    function setRenewable(checkout) {
      const checkoutLimit = addDays(time.now(), -config.renewalLimitDays);
      checkout.renewable = checkout.checkout_date > checkoutLimit;
      return checkout;
    }

    /**
     * Returns the promise of checkout records joined with the associated item
     * information. The table is either the checkouts table 'out' or the history
     * table 'issue_history'. If feesOnly is true, only records with outstanding
     * fees will be returned.
     */
    function getCheckouts(table, borrowerNumber, feesOnly, limit, order) {
      var sql = 'select a.*, b.* from items a ' +
        'inner join ' + table + ' b on a.barcode = b.barcode ' +
        'where b.borrowernumber = ?';
      if (feesOnly) {
        sql += ' and b.fine_due > b.fine_paid';
      }
      return db.selectRows(sql, [borrowerNumber], limit, order).then(
          result => {
            result.rows.forEach(setRenewable);
            return result;
          });
    }

    borrowers.checkouts = function (borrowerNumber, feesOnly, limit) {
      return getCheckouts('`out`', borrowerNumber, feesOnly, limit);
    };

    borrowers.history = function (borrowerNumber, feesOnly, limit, order) {
      return getCheckouts('issue_history', borrowerNumber, feesOnly, limit, order);
    };

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
        var newFeeItems = data[0].rows;
        var oldFeeItems = data[1].rows;
        return {
          total: totalFine(newFeeItems) + totalFine(oldFeeItems),
          items: newFeeItems,
          history: oldFeeItems
        };
      });
    };

    /**
     * Override the borrowers' get method to optionally fetch the checked out
     * items, history, and fees.
     */
    borrowers.get = function (borrowernumber, options) {
      options = options || {};
      return this.constructor.prototype.get.call(this, borrowernumber).then(
        borrower => {
          const extras = [];
          if (options.items) {
            extras.push(this.checkouts(borrowernumber)
              .then(result => borrower.items = result.rows));
          }
          if (options.history) {
            extras.push(this.history(borrowernumber)
              .then(result => borrower.history = result.rows));
          }
          if (options.fees) {
            extras.push(this.fees(borrowernumber)
              .then(result => borrower.fees = result));
          }
          return Q.all(extras).then(() => borrower);
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
    };

    /**
     * Renews all items of a borrower.
     */
    borrowers.renewAllItems = function (borrowerNumber) {
      const newDueDate = addDays(time.now(), config.renewalDays);
      const checkoutLimit = addDays(time.now(), -config.renewalLimitDays);
      return db.query(
        "update `out` a, items b " +
        "set a.date_due = ? " +
        "where borrowernumber = ? and a.barcode = b.barcode " +
        "and a.checkout_date > ?",
        [newDueDate, borrowerNumber, checkoutLimit]);
    };

    function feeQuery(table) {
      return 'select * from (' +
        'select a.borrowernumber, a.surname, a.contactname, a.firstname, ' +
        'sum(if(b.fine_paid > b.fine_due, 0, b.fine_due - b.fine_paid)) as fee ' +
        'from borrowers a ' +
        'join ' + table + ' b on a.borrowernumber = b.borrowernumber ' +
        'group by a.borrowernumber) fees where fee > 0';
    }

    /**
     * Returns promise of the list of borrowers with fees due.
     */
    borrowers.allFees = function () {
      return Q.all([db.selectRows(feeQuery('`out`')),
                    db.selectRows(feeQuery('issue_history'))])
        .then(function (data) {
          var borrowers = {};
          var newItems = data[0].rows;
          var oldItems = data[1].rows;
          newItems.forEach(function (borrower) {
            borrower.newFee = borrower.fee;
            borrower.oldFee = 0;
            borrowers[borrower.borrowernumber] = borrower;
          });
          oldItems.forEach(function (borrower) {
            borrower.oldFee = borrower.fee;
            borrower.newFee = 0;
            if (borrowers[borrower.borrowernumber] === undefined) {
              borrowers[borrower.borrowernumber] = borrower;
            } else {
              borrowers[borrower.borrowernumber].fee += borrower.fee;
              borrowers[borrower.borrowernumber].oldFee = borrower.fee;
            }
          });
          return Object.keys(borrowers).map(key => borrowers[key]);
        });
    };

    const getFees = function (query, limit) {
      const sql = 'select * from (' +
        feeQuery('`out`') + ' union ' + feeQuery('issue_history') + ') fees';
      return db.selectRows(sql, [], limit, query._order);
    };

    // items table/entity
    var items = entity(db, {
      name: 'items',
      columns: [
        { name: 'barcode', required: true, domain: domains.Barcode },
        { name: 'category', label: 'Category', required: true,
          domain: domains.ItemDescription },
        { name: 'subject', required: true,
          domain: domains.ItemSubject },
        { name: 'added', label: 'Date Added', internal: true },
        { name: 'title', required: true, queryOp: 'contains' },
        { name: 'author', queryOp: 'contains' },
        { name: 'publicationyear', label: 'Publication Year' },
        { name: 'publisher', label: 'Publisher' },
        { name: 'age', label: 'Reading Age', domain: domains.ItemAge },
        { name: 'serial', label: 'Number in Series' },
        { name: 'seriestitle', label: 'Series Title', queryOp: 'contains' },
        { name: 'classification' },
        { name: 'itemnotes', label: 'Notes' },
        { name: 'replacementprice', label: 'Replacement Price' },
        { name: 'state', required: true, domain: domains.ItemState },
        { name: 'antolin', label: 'Antolin Book ID' },
        { name: 'isbn10', label: 'ISBN-10' },
        { name: 'isbn13', label: 'ISBN-13' }],
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
    };

    /**
     * Returns the promise of the issue_history entries for the item with the given
     * barcode. Adds the surname of the associated borrower.
     */
    function getItemHistory(barcode) {
      var sql = 'select h.*, b.* from issue_history h, borrowers b ' +
        'where h.barcode = ? and h.borrowernumber = b.borrowernumber';
      return db.selectRows(sql, barcode);
    }

    /**
     * Returns the promise of an item together with its checkout information.
     * Throws an error if the item does not exist.
     */
    items.get = function (barcode, options) {
      options = options || {};
      var result;
      return items.constructor.prototype.get.call(this, barcode)
        .then(item => {
          result = item;
          return checkouts.find(barcode);
        })
        .then(checkout => {
          if (checkout) {
            result.checkout = checkout;
            return borrowers.get(checkout.borrowernumber).then(borrower => {
              result.borrower = borrower;
              return result;
            });
          } else {
            return result;
          }
        })
        .then(() => {
          if (options['history']) {
            return getItemHistory(barcode).then(history => {
              result.history = history.rows;
              return result;
            });
          } else {
            return result;
          }
        });
    };

    /**
     * Returns promise to result containing items and their checkout status.
     */
    items.read = function (query, op, limit) {
      var self = this;
      var result;
      return items.constructor.prototype.read.call(self, query, op, limit)
        .then(function (items) {
          result = items;
          return Q.all(
            items.rows.map(function(item) {
              return checkouts.find(item.barcode);
            }))
            .then(function(checkouts) {
              for (i=0; i < result.rows.length; ++i) {
                result.rows[i].checkout = checkouts[i];
              }
              return result;
            });
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

          // Copy checkout to history.
          checkout.returndate = new Date();
          delete checkout.id;
          return history.create(checkout);
        })
        .then(function () {
          // If successfully copied to history, remove from checkouts.
          return checkouts.remove(barcode);
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
        checkout.date_due = addDays(time.now(), config.renewalDays);
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
        .then(function (item) {
          if (item.checkout) {
            throw {
              httpStatusCode: 400, code: 'ITEM_ALREADY_CHECKED_OUT', errno: 1105,
              checkout: item.checkout
            };
          }
          if (item.state !== 'CIRCULATING') {
            throw {
              httpStatusCode: 400, code: 'ITEM_NOT_CIRCULATING', errno: 1106,
              item: item
            };
          }
          result.item = item;
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
    };

    var reports = {};

    reports.getItemUsage = function(query) {
      var itemsWhere = items.sqlWhere(query);
      var sql = 'select a.*, max(h.checkout_date) as last_checkout_date ' +
                'from items a, issue_history h ' +
                (itemsWhere.sql ? itemsWhere.sql + ' and ' : ' where ') +
                ' a.barcode = h.barcode ' +
                'group by a.barcode having last_checkout_date < ?';
      itemsWhere.params.push(query.lastCheckoutDate);
      return db.selectRows(sql, itemsWhere.params);
    };

    reports.getOverdue = query => {
      const sql = 'select * from borrowers a, ' +
        '(select  borrowernumber, count(1) as count from `out` a ' +
        ' where a.checkout_date < ? group by a.borrowernumber) b ' +
        'where a.borrowernumber = b.borrowernumber';
      return db.selectRows(sql, [query.last_checkout_date]);
    };

    return {
      borrowers: borrowers,
      getFees: getFees,
      items: items,
      checkouts: checkouts,
      history: history,
      reports: reports,
    };
  }
};
