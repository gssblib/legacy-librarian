/**
 * Main angularjs file. Defines the "library" module and the mapping from
 * routes to views.
 */

angular.module("library")
/**
 * Utility service providing helper functions.
 */
.factory('util', function () {
  var audioContext = (function () {
    try {
      return new (window.AudioContext || window.webkitAudioContext);
    } catch (e) {
      console.log('audio API not supported');
      return null;
    }
  })();

  function str(o) { return o ? String(o) : ''; }
  function add(a, b) { return a + b; }
  function sum(values) { return values.reduce(add, 0); }

  function getter(field) {
    return function (obj) { return obj[field]; };
  }

  function setter(field) {
    return function (obj, value) { obj[field] = value; };
  }

  /**
   * Returns the string combining the given fields of an object, separator
   * by the separator string (which defaults to ", ").
   */
  function joinFields(obj, fields, separator) {
    return fields.map(
      function (field) { return str(obj[field]); }).join(separator || ", ");
  }

  /**
   * Returns an array containing the numbers from offset to (but not including)
   * limit using the step.
   */
  function range(offset, limit, step) {
    step = step || 1;
    var result = [];
    result.offset = offset;
    result.limit = limit;
    result.step = step;
    for (var i = offset; i < limit; i += step) result.push(i);
    return result;
  };

  function fields(obj, names) {
    var result = undefined;
    for (var i = 0; i < names.length; ++i) {
      var name = names[i];
      var value = obj[name];
      if (!angular.isUndefined(value)) {
        result = result || {};
        result[name] = obj[name];
      }
    }
    return result;
  }

  /**
   * Class encapsulating the pagination information of 'count' items.
   */
  function Pagination(count, pageSize, page) {
    page = page || 0;
    this.count = count;
    this.pageSize = pageSize;
    this.pageCount = Math.ceil(count / pageSize);
    this.setPage(page);
  }

  Pagination.prototype.setPage = function (page) {
    this.page = page;
    this.from = page * this.pageSize;
    this.to = Math.min(this.from + this.pageSize, this.count);
    this.firstPage = Math.max(0, page - 2);
    this.pageRange = range(this.firstPage, Math.min(this.firstPage + 4, this.pageCount));
    this.showFirst = this.pageRange.offset > 0;
    this.showLast = this.pageRange.limit < this.pageCount;
  };

  function pagination(count, pageSize, page) {
    return new Pagination(count, pageSize, page);
  }

  return {
    str: str,
    add: add,
    sum: sum,
    getter: getter,
    setter: setter,
    joinFields: joinFields,
    range: range,
    pagination: pagination,
    fields: fields
  };
});
