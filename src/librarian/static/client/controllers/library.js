angular.module("library")
.controller("libraryCtrl", function ($scope, $http) {
})
/**
 * Input element directive that lets the user type only digits.
 *
 * See http://stackoverflow.com/a/25886951 and
 * https://docs.angularjs.org/api/ng/type/ngModel.NgModelController.
 */
.directive('onlyDigits', function(util) {
  return {
    require: '?ngModel',
    restrict: 'A',
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return;
      ngModel.$parsers.push(function (value) {
	if (!value) return value;
        var digits = value.replace(/[^0-9]/g, '');
        if (digits != value) {
          ngModel.$setViewValue(digits);
          ngModel.$render();
          util.beep();
        }
	return digits;
      });
    }
  };
});
