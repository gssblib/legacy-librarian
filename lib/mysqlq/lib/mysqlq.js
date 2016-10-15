/**
 * "promising" wrapper of mysql using q.
 */
const Q = require('q'),
      dbs = {};

/**
 * Connection pool providing the promise API.
 *
 * The pool has to have a getConnection method taking an (err, connection)
 * callback. The connection object must have two methods:
 *
 *   query(sql, params, callback):
 *       executes a query and returns the data to the (err, data) callback.
 *
 *   release():
 *       returns the connection to the pool.
 */
function Db(pool, logger) {
  this.pool = pool;
  this.logger = logger || require('winston');
}

/**
 * Returns promise of a connection obtained from the connection pool.
 */
Db.prototype.getConnection = function () {
  self = this;
  return Q.ninvoke(self.pool, "getConnection").fail(function (err) {
    self.logger.error('error getting connection: ' + err);
    throw err;
  });
};

/**
 * Returns promise of executing the query using a new connection from
 * the connection pool.
 */
Db.prototype.query = function (sql, params) {
  console.log('query', sql, params);
  self = this;
  return self.getConnection().then(
    function (connection) {
      return Q.ninvoke(connection, "query", sql, params).fin(function () {
	try {
	  connection.release();
	} catch (e) {
	  self.logger.error('error releasing connection:' + e);
	}
      });
    },
    function (err) {
      console.log('query error', err);
      throw err;
    }
  );
};

/** Returns array of rows contained in a database result object. */
function getRows(data) {
  return data[0];
}

/**
 * Returns promise of a single row. More than one row is considered an error.
 * No matching row results in an undefined value.
 */
Db.prototype.selectRow = function (sql, params) {
  var self = this;
  return self.query(sql, params).then(function (data) {
    var rows = getRows(data);
    if (rows.length > 1) {
      throw { code: 'MORE_THAN_ONE_ROW', errno: 1001 };
    }
    return rows[0];
  });
}

/**
 * Returns promise of selected rows.
 *
 * The result is returned as an object with the list of rows in the 'rows'
 * property and, if requested, the total number of rows in the 'count' property.
 */
Db.prototype.selectRows = function(sql, params, limit) {
  var self = this;
  var valueSql = sql;
  var valueParams = params;

  if (limit) {
    valueSql += " limit ?, ?";
    valueParams = params.concat([limit.offset, limit.limit]);
  }
  if (limit && limit.returnCount) {
    var result = {};
    var countSql = 'select count(1) as count from (' + sql + ') a';
    return self.selectRow(countSql, params)
      .then(function (row) {
	result.count = row.count;
	return self.query(valueSql, valueParams);
      })
      .then(function (data) {
	result.rows = data[0];
	return result;
      });
  } else {
    return self.query(valueSql, valueParams).then(function (data) {
      return {
        rows: data[0]
      };
    });
  }
}

module.exports = function (pool, name) {
  name = name || '_default_';
  if (!dbs[name]) {
    dbs[name] = new Db(pool);
  }
  return dbs[name];
};
