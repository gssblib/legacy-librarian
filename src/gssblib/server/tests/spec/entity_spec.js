const entity = require('../../entity'),
      Q = require('q');

describe('entity', function () {
  it('creates insert statement', function (done) {
    var deferred = Q.defer();
    var db = {
      query: function (sql, params) {
        expect(sql).toEqual('insert into `person` (first_name, last_name) values (?, ?)');
        return deferred.promise;
      }
    };
    var persons = entity(db, {name: 'person', columns: ['first_name', 'last_name']});
    var person = {first_name: 'Homer', last_name: 'Simpson'}
    persons.create(person).then(function (row) {
      expect(row.id).toEqual(10);
      done();
    });
    deferred.resolve([{insertId: 10}]);
  }, 100);

  it('creates sql term for column', function () {
    var db = undefined; // not needed for this test

    // Define entity with two columns, one simple column ('first_name') and
    // one with default queryOp ('last_name').
    var persons = entity(db, {
        name: 'person',
        columns: [
          'first_name',
          {name: 'last_name', queryOp: 'contains'}
        ]
    });

    expect(persons.sqlTerm('first_name', 'foo'))
        .toEqual({field: 'first_name', op: '=', value: 'foo'});

    expect(persons.sqlTerm('first_name', {value: 'foo', op: 'startswith'}))
        .toEqual({field: 'first_name', op: 'like', value: 'foo%'});

    expect(persons.sqlTerm('last_name', 'foo'))
        .toEqual({field: 'last_name', op: 'like', value: '%foo%'});
  });

  it('creates sql terms for query', function () {
    var persons = entity(undefined, {name: 'person', columns: ['first_name', 'last_name']});

    expect(persons.sqlTerms(100))
        .toEqual([{field: 'id', op: '=', value: 100}]);

    expect(persons.sqlTerms({first_name: 'Homer', last_name: 'Simpson'}))
        .toEqual([
            {field: 'first_name', op: '=', value: 'Homer'},
            {field: 'last_name', op: '=', value: 'Simpson'}
        ]);
  });

  it('create sql where clause', function () {
    var persons = entity(undefined, {name: 'person', columns: ['first_name', 'last_name']});
    expect(persons.sqlWhere(150))
        .toEqual({sql: ' where id = ?', params: [150]});

    expect(persons.sqlWhere({first_name: 'Homer', last_name: 'Simpson'}))
        .toEqual({sql: ' where first_name = ? and last_name = ?', params: ['Homer', 'Simpson']});
  });
});

