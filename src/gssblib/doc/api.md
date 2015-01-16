# Library REST API

Angular client and node.js server communicate using a (more or less) RESTful
API.

## HTTP Methods

Read requests use GET, updates use PUT, and new objects are created with POST.
Service methods use POST.  In case of PUT and POST, the request body contains
the JSON object to be updated or created or service specific request data in
case of service methods.

All API requests use `/api` as a path prefix.  A `/items` request, for example,
uses the path `/api/items`.

## Success and Error Responses

If the request is processed successfully, the server responds with OK (200) and
the result as a JSON object or array of objects.  The JSON objects reflect the
database objects (1-1 mapping of columns to properties).

In case of an error, the server responds with an HTTP status code reflecting
the kind of error and a JSON object that contains the error details as the
`error` property.  Under normal circumstances, the server should only return
4xx (client) error codes.  The 5xx error codes indicate a problem with the
system (software error or operational problem).

The error object contains the following fields:

* `code`: a string (all uppercase with underscores) identifying the type of error
* `message`: optional textual description of the error

In case of a 4xx error, the client should select an appropriate error message
based on the error code or choose another suitable action (e.g., a login dialog
in case of an authorization error due to an expired server-side session).  A
5xx error can be reported as a generic server error (that requires analysis on
the server side).

Specific HTTP response codes used:

* 400 (Bad Request): Invalid request, e.g., missing or invalid parameters.
* 404 (Not Found): Invalid path.
* 401 (Unauthorized): Returned if the client (current session) is not
  authorized to perform the requested operation.
* 406 (Conflict): Attempt to insert a duplicate (primary key violation).
* 500 (Internal Server Error): Catch all for unhandled server errors.

## Resources

When asking for multiple resources, the client may specify a range (e.g., for
pagination) using the `offset` and `limit` parameters.  `offset` is the
zero-based index to start with, `limit` the maximal number of objects to
return, and the `returnCount` flag controls whether the server should also
return the total number of items..

### Items

* base path `/items`
* standard GET, PUT (update), POST (create)
* items identified by barcode (`/items/:barcode`)
* query (GET) with barcode, title (contains), author (contains)
* return item:
  * POST `/items/:barcode/return`
  * response: updated checkout record
  * errors:
    * 400, `ITEM_NOT_FOUND`
    * 400, `ITEM_NOT_CHECKED_OUT`
* renew item
  * POST `/items/:barcode/renew`
  * response: updated checkout record
  * errors:
    * 400, `ITEM_NOT_FOUND`
    * 400, `ITEM_NOT_CHECKED_OUT`
* check out item
  * POST `/items/:barcode/checkout` with body {borrower: *borrower number*}
  * result in response: updated item
  * errors:
    * 400, `ITEM_NOT_FOUND`
    * 400, `ITEM_ALREADY_CHECKED_OUT`
    * 400, `BORROWER_NOT_FOUND`

### Borrowers

* base path `/borrowers`
* standard GET, PUT (update), POST (create)
* borrowers identified by borrower number (`/borrowers/:number`)
* query (GET) with surname (contains)

### Users

* base path `/users`
* current user
  * GET `/users/current`
  * response: currently logged-in user with permissions
  * errors:
    * 400, `NOT_LOGGED_IN` (not logged in or session expired)
* authenticate
  * POST `/users/authenticate`
  * request: {username: *username*, password: *password*}
  * errors:
    * 401 (Unauthorized): invalid credentials provided
* logout
  * POST `/users/logout`
  * response: {success: true}
  * errors:
    * 400, `NOT_LOGGED_IN` (not logged in or session expired)

