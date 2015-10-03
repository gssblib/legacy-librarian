describe('Library Service', function () {

  var api_prefix = '/api';
  var $httpBackend, library;

  beforeEach(module('library'));

  beforeEach(inject(function (_$httpBackend_, _library_) {
    $httpBackend = _$httpBackend_;
    library = _library_;
    jasmine.addMatchers(CustomMatchers.promiseMatchers($httpBackend));
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('method: getItem', function() {

    it('gets item by barcode', function () {
      var backendItem = {barcode: '1234', title: 'Jim Knopf'};
      $httpBackend.expectGET(api_prefix + '/items/1234').respond(backendItem);
      expect(library.getItem('1234')).toBeResolvedWith(backendItem);
    });

    it('propagates backend error', function () {
      var backendItem = {barcode: '1234', title: 'Jim Knopf'};
      $httpBackend.expectGET(api_prefix + '/items/1234').respond(400, backendItem);
      expect(library.getItem('1234')).toBeRejectedWith(jasmine.any(Object));
    });

    it('saves item via PUT and returns saved item with id', function () {
      var item = {barcode: '1234'};
      var savedItem = {id: 1, barcode: '1234'};
      $httpBackend.expectPUT(api_prefix + '/items').respond(200, savedItem);
      expect(library.saveItem(item)).toBeResolvedWith(savedItem);
    });

    /**
     * The following commented-out version does the same thing as the first test, but
     * using jasmine's async support (the "done" callback of the it() function).
     *
     * This approach leads to a "$digest already in progress" error in the
     * verifyNoOutstandingExpectation call in afterEach.  It works fine without this
     * check or when performing this check in the it() call after the $httpBackend.flush().
     * It looks like the afterEach functions are called from the "done" function which
     * is called from $httpBackend.flush().
     *
     * See http://stackoverflow.com/questions/24341544 for a similar situation.
     */
    /*
    it('gets item by barcode (async version)', function (done) {
        var backendItem = {barcode: '1234', title: 'Jim Knopf'};
        $httpBackend.expectGET(api_prefix + '/items/1234').respond(backendItem);
        library.getItem('1234')
          .then(function (item) {
            expect(item).toEqual(backendItem);
          })
          .finally(done);
        $httpBackend.flush();
    });
    */
  });
});
