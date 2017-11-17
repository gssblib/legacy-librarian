const library = require('../../library'),
      Q = require('q'),
      merge = require('merge');

describe('library', function () {

  describe('items', function () {
    // Prepare item data that will be returned by the mock db.
    var barcode = '000000001';
    var borrowernumber = 1000;
    var dateDue = new Date();
    var item = {
      barcode: barcode,
      title: 'Some Book'
    };
    var fullItem = merge(item, {
        checkout: { barcode: barcode, borrowernumber: borrowernumber, date_due: dateDue },
      borrower: { borrowernumber: borrowernumber, surname: 'Doe' }
    });

    function createDeferreds(n) {
      var deferreds = [];
      for (var i = 0; i < n; ++i) {
        deferreds.push(Q.defer());
      }
      return deferreds;
    }

    it('gets item with checkout information', function (done) {
      // Prepare the mock db.
      var deferreds = createDeferreds(3);
      var count = 0;
      var db = {
        selectRow: function (sql, params) {
          return deferreds[count++].promise;
        }
      };
      var lib = library.create(db);

      // Ask the library for the full item with checkout and borrower.
      lib.items.get(barcode).then(function (data) {
        expect(data).toEqual(fullItem);
        done();
      });

      // Resolve the three asynchronous db calls.
      deferreds[0].resolve(item);
      deferreds[1].resolve(fullItem.checkout)
      deferreds[2].resolve(fullItem.borrower)
    }, 100);

    it('renews item by setting due date to today plus configured number of days', function (done) {
      var deferreds = createDeferreds(4);
      var count = 0;
      var db = {
        selectRow: function (sql, params) {
          return deferreds[count++].promise;
        },
        query: function (sql, params) {
          return deferreds[count++].promise;
        }
      };
      // Define mock time functions returning a fixed value for 'now'.
      var time = {
        now: function () { return new Date(2015, 7 - 1, 15); }
      }
      var lib = library.create(db, { renewalDays: 10 }, time); 
      lib.items.renew(barcode).then(function (data) {
        var checkout = data.checkout;
        expect(checkout.date_due).toEqual(new Date(2015, 7 - 1, 25));
        done();
      });
      deferreds[0].resolve(item);
      deferreds[1].resolve(fullItem.checkout)
      deferreds[2].resolve(fullItem.borrower)
      deferreds[3].resolve({})
    }, 100);
  });
});
