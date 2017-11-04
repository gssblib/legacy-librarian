const Q = require('q');

/**
 * Simple module simplifying the handling of promises in express
 * HTTP handlers.
 */
module.exports = function(server, api_prefix) {

  /**
   * Class wrapping a node HTTP request and response and adding some
   * convenience methods.
   */
  function HttpCall(req, res) {
    this.req = req;
    this.res = res;
  }

  /**
   * Returns a request parameter (with converter function and default value).
   */
  HttpCall.prototype.param = function (name, converter, defaultValue) {
    var value = this.req.param(name);
    converter = converter || String;
    return value === undefined ? defaultValue : converter(value);
  };

  /**
   * Returns the named request parameters as an object.
   */
  HttpCall.prototype.params = function (names) {
    var self = this;
    var values = {};
    names.forEach(function (name) {
      var value = self.param(name);
      if (value !== undefined) {
        values[name] = value;
      }
    });
    return values;
  };

  HttpCall.prototype.flags = function (param) {
    var names = this.param(param, function (s) { return s.split(','); }, []);
    var flags = {};
    for (var i = 0; i < names.length; ++i) {
      flags[names[i]] = true;
    }
    return flags;
  };

  /**
   * Returns the offset and limit request parameters as an object.
   */
  HttpCall.prototype.limit = function paramLimit() {
    return {
      offset: this.param('offset', Number, 0),
      limit: this.param('limit', Number, 100),
      returnCount: this.param('returnCount')
    };
  };

  /**
   * Returns the query operator in case we have multiple criteria.
   */
  HttpCall.prototype.op = function paramOp() {
    return this.param('op', String, 'and');
  };

  /**
   * Translates the result of a service promise to an HTTP response.
   */
  HttpCall.prototype.handlePromise = function (promise) {
    var self = this;
    promise.then(
      function (result) {
        self.res.status(200).json(result);
      },
      function (err) {
        console.log('handlePromise error: ', err);
        self.res.status(err.httpStatusCode || 500).json(err);
      });
  };

  /**
   * Returns true if the action is authorized by the permissions.
   */
  function authorized(permissions, action) {
    for (var i = 0; i < permissions.length; ++i) {
      var permission = permissions[i];
      if (action.resource === permission.resource
	  && permission.operations.indexOf(action.operation) >= 0) {
	return true;
      }
    }
    return false;
  };

  HttpCall.prototype.isAuthorized = function (action) {
    var self = this;
    var user = self.req.session.user;
    var result = user && user.permissions && authorized(user.permissions, action);
    if (!result) {
      console.log('authorization failed: user=', user, ', action=', action);
    }
    return true;
  };

  /**
   * Returns a node HTTP callback wrapping a function that takes an HttpCall
   * and returns a promise (a "call handler").
   */
  function httpHandler(handler) {
    return function (req, res) {
      var call = new HttpCall(req, res);
      if (handler.action && !call.isAuthorized(handler.action)) {
        call.res.status(401).json({});
      } else {
        var promise = handler.fn(call);
        call.handlePromise(promise);
      }
    };
  }

  function handlePath(handler) {
    if (handler.get) {
      server.get(api_prefix + handler.get, httpHandler(handler));
    } else if (handler.put) {
      server.put(api_prefix + handler.put, httpHandler(handler));
    } else if (handler.post) {
      server.post(api_prefix + handler.post, httpHandler(handler));
    }
  }

  /**
   * Registers multiple call handlers. Each handler is an object with a
   * path and a call handler function.
   */
  function handlePaths(handlers) {
    for (var i = 0; i < handlers.length; ++i) {
      handlePath(handlers[i]);
    }
  }

  /**
   * Registers the RESTful handlers for the entity.
   */
  function handleEntity(entity, methods) {
    var basePath = '/' + entity.name;
    var keyPath = basePath + '/:key';
    handlePath({
      get: basePath + '/fields',
      fn: function (call) { return Q(entity.fields()); },
      action: {resource: entity.name, operation: 'read'}
    });
    handlePath({
      get: keyPath,
      fn: function (call) { return entity.get(call.param('key'), call.flags('options')); },
      action: {resource: entity.name, operation: 'read'}
    });
    handlePath({
      get: basePath,
      fn: function (call) { return entity.read(call.req.query, call.op(), call.limit()); },
      action: {resource: entity.name, operation: 'read'}
    });
    handlePath({
      put: basePath,
      fn: function (call) { return entity.update(call.req.body); },
      action: {resource: entity.name, operation: 'update'}
    });
    handlePath({
      post: basePath,
      fn: function (call) { return entity.create(call.req.body); },
      action: {resource: entity.name, operation: 'create'}
    });
    if (methods) {
      methods.forEach(function (method) {
        handlePath({
          post: keyPath + '/' + method,
          fn: function (call) { return entity[method](call.param('key'), call.req.body); },
          action: {resource: entity.name, operation: method}
        });
      });
    }
  }

  return {
    handlePath: handlePath,
    handlePaths: handlePaths,
    handleEntity: handleEntity
  };
};
