
CustomMatchers = {
  promiseMatchers: function(flushable) {
    return {
      /**
       * Checks that the promise's success handler is called with a matching argument
       * after the flushable has been flushed.
       */
      toBeResolvedWith: function(util, customEqualityTesters) {
        return {
          compare: function(promise, expectedArg) {
            var handler = jasmine.createSpy('success');
            promise.then(handler);
            flushable.flush();
            var result = {};
            result.pass = util.contains(
              handler.calls.allArgs(), [expectedArg], customEqualityTesters);
            if (result.pass) {
              result.message = function() {
                return 'Expected promise not to be resolved with ' + jasmine.pp(expectedArg);
              };
            } else {
              result.message = function() {
                return 'Expected promise to be resolved with ' + jasmine.pp(expectedArg);
              };
            }
            return result;
          }
        };
      },
      /**
       * Checks that the promise's error handler is called with a matching argument
       * after flushable has been flushed.
       */
      toBeRejectedWith: function(util, customEqualityTesters) {
        return {
          compare: function(promise, expectedArg) {
            var handler = jasmine.createSpy('error');
            promise.then(undefined, handler);
            flushable.flush();
            var result = {};
            result.pass = util.contains(
              handler.calls.allArgs(), [expectedArg], customEqualityTesters);
            if (result.pass) {
              result.message = function() {
                return 'Expected promise not to be rejected with ' + jasmine.pp(expectedArg);
              };
            } else {
              result.message = function() {
                return 'Expected promise to be rejected with ' + jasmine.pp(expectedArg);
              };
            }
            return result;
          }
        };
      }
    }
  }
};
