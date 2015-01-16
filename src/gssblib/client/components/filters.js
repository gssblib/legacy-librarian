angular.module('library')
.filter('range', function ($filter) {
  return function (data, page, size) {
    if (!angular.isArray(data) || !angular.isNumber(page) || !angular.isNumber(size)) return data;
    var offset = page * size;
    if (data.length < offset) return [];
    return $filter('limitTo')(data.splice(offset), size);
  };
});

