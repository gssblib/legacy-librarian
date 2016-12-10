angular.module("library")
/**
 * Input element directive that lets the user type only digits.
 *
 * See http://stackoverflow.com/a/25886951 and
 * https://docs.angularjs.org/api/ng/type/ngModel.NgModelController.
 *
 * This directive does not work propery in combination with minlength,
 * because it will reset the text input whenever a non-digit is entered.
 */
.directive('onlyDigits', function(util) {
  return {
    require: '?ngModel',
    restrict: 'A',
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return;
      ngModel.$parsers.push(function (value) {
        if (!value) return value;
        var digits = value.replace(/[^0-9]+/g, '');
        if (digits != value) {
          ngModel.$setViewValue(digits);
          ngModel.$render();
        }
        return digits;
      });
    }
  };
})
/**
 * Restrict input for ISBN fields.
 *
 * For now, we only check if the characters are digits or 'X'.
 */
.directive('isbn', function(util) {
  return {
    require: '?ngModel',
    restrict: 'A',
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return;
      ngModel.$parsers.push(function (value) {
        if (!value) return value;
        var digits = value.replace(/[^0-9X]+/g, '');
        if (digits != value) {
          ngModel.$setViewValue(digits);
          ngModel.$render();
        }
        return digits;
      });
    }
  };
})
.directive('autofocus', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
      $timeout(function() {
        $element[0].focus();
      });
    }
  };
});
