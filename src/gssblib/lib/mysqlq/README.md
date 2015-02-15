# Q-based Promise API for mysql

This module provides a small wrapper around mysql connection pools that turns
the callback-based API into a promise-based API using the Q library.

This module is similar to the mysql-promise module. Q's ninvoke makes it easy
to wrap the typical node APIs of the mysql module and release the connections
after use.

This module does not directly depend on the mysql module, but expects a
connection pool following the mysql API and was only tested with the mysql
module.

Besides the generic query method, the database wrapper offers two convenience
methods for selecting a single row and multiple rows with a limit (for
pagination).

  selectRow(sql, params, options)
  selectRows(sql, param, limit)

## Install

```bash
npm install mysqlq
```

### Setup and Plain Query

```javascript
var mysql = require('mysql'),
    mysqlq = require('mysqlq'),
    db = mysqlq(mysql.createPool({host: ...}));

db.query('select * from foo where id = ?', id).then(function (data) {
  var rows = data[0];
  ...
}, function (err) {
  // handle error
});
```
