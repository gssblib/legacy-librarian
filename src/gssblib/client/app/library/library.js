/**
 * Service providing access to the library REST API.
 */
angular.module("library")
.factory("library", function ($http) {
  var api_prefix = '/api';

  // returned service object
  var library = {};

  // service-level variable keeping items returned in the current session
  var returnedItems = [];

  function getData(response) {
    return response && response.data;
  }

  function httpGet(path, params) {
    return $http.get(api_prefix + path, {params: params}).then(getData);
  }

  function httpPut(path, obj) {
    return $http.put(api_prefix + path, obj).then(getData);
  }

  function httpPost(path, obj) {
    return $http.post(api_prefix + path, obj).then(getData);
  }

  library.getItem = function (barcode, params) {
    return httpGet('/items/' + barcode, params);
  };

  library.createItem = function (item) {
    return httpPost('/items', item);
  };

  library.saveItem = function (item) {
    return httpPut('/items', item);
  };

  library.getItems = function (criteria, offset, limit, returnCount) {
    var params = angular.copy(criteria);
    if (limit) {
      params.offset = offset;
      params.limit = limit;
    }
    if (returnCount) {
      params.returnCount = true;
    }
    return httpGet('/items', params);
  };

  library.returnItem = function (barcode) {
    return httpPost('/items/' + barcode + '/checkin')
      .then(function (data) {
        returnedItems.push(data);
        return data;
      });
  };

  library.renewItem = function (barcode) {
    return httpPost('/items/' + barcode + '/renew');
  };

  library.renewBorrowerItems = function (borrowernumber) {
    return httpPost('/borrowers/' + borrowernumber + '/renewAllItems');
  };

  library.checkOutItem = function (barcode, borrowerNumber) {
    return httpPost('/items/' + barcode + '/checkout', {borrower: borrowerNumber});
  };

  library.payFees = function (borrowerNumber) {
    return httpPost('/borrowers/' + borrowerNumber + '/payFees');
  };

  library.payFee = function (item) {
    if (item.type === 'checkouts') {
      return httpPost('/checkouts/' + item.barcode + '/payFee');
    } else {
      return httpPost('/history/' + item.id + '/payFee');
    }
  };

  library.waiveFee = library.payFee;

  library.returnedItems = function () { return returnedItems; };

  library.getBorrower = function (borrowerNumber, params) {
    return httpGet('/borrowers/' + borrowerNumber, params);
  };

  library.createBorrower = function (borrower) {
    return httpPost('/borrowers', borrower);
  };

  library.saveBorrower = function (borrower) {
    return httpPut('/borrowers', borrower);
  };

  library.getBorrowers = function (surname, offset, limit) {
    return httpGet('/borrowers', {
      surname: surname, offset: offset, limit: limit
    });
  };

  library.getFees = function () {
    return httpGet('/borrowers/fees');
  };

  library.updateFees = function (date) {
    return httpPost('/checkouts/updateFees', {date: date});
  };

  return library;
});

