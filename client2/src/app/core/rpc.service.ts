import {Observable, throwError as observableThrowError} from 'rxjs';
import {catchError} from "rxjs/operators";
import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {ConfigService} from "./config.service";
import {RpcError} from "./rpc-error";

/**
 * Support for RPC (REST over HTTP) calls.
 *
 * All calls return an Observable with the JSON response. In case of an error,
 * the Observable throws an RpcError.
 */
@Injectable()
export class RpcService {

  constructor(
    private router: Router,
    private http: HttpClient,
    private config: ConfigService,
  ) { }

  public getJWTAuthToken() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      return 'Bearer ' + currentUser.token;
    }
  }

  private addJwt(options?) {
    // ensure request options and headers are not null
    options = options || {};
    options.headers = options.headers || new HttpHeaders();

    // add authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      options.headers = options.headers.append('Authorization', 'Bearer ' + currentUser.token);
    }

    return options;
  }

  /**
   * Combines the search criteria with the pagination parameters.
   */
  private createSearchParams(
      criteria: object, offset?: number, limit?: number, returnCount?: number) {
    const params: any = Object.assign({}, criteria);
    if (limit) {
      params.offset = offset;
      params.limit = limit;
    }
    if (returnCount) {
      params.returnCount = returnCount;
    }
    return params;
  }

  /**
   * Handles the HTTP response containing the JSON payload.
   */
  private handleHttpResult(observable: Observable<Object>): Observable<Object> {
    return observable.pipe(catchError(response => this.handleError(response)));
  }

  /**
   * Sends a GET request to the API server.
   *
   * @param path Path relative to the API path.
   * @param params Query parameters
   * @returns {Observable<Object>} JSON result observable
   */
  httpGet(path: string, params?: {[param: string]: string}): Observable<any> {
    return this.handleHttpResult(
      this.http.get(this.config.apiPath(path), this.addJwt({params: params || {}})));
  }

  /**
   * Sends a POST request to the API server.
   *
   * @param path Path relative to the API path.
   * @param body POST payload
   * @returns {Observable<Object>} JSON result observable
   */
  httpPost(path: string, body?: any): Observable<Object> {
    return this.handleHttpResult(
      this.http.post(this.config.apiPath(path), body, this.addJwt()));
  }

  /**
   * Sends a PUT request to the API server.
   *
   * @param path Path relative to the API path.
   * @param body PUT payload
   * @returns {Observable<Object>} JSON result observable
   */
  httpPut(path: string, body?: any): Observable<Object> {
    return this.handleHttpResult(
      this.http.put(this.config.apiPath(path), body, this.addJwt()));
  }

  /**
   * Sends a DELETE request to the API server.
   *
   * @param path Path relative to the API path.
   * @param body DELETE payload
   * @returns {Observable<Object>} JSON result observable
   */
  httpDelete(path: string): Observable<Object> {
    return this.handleHttpResult(
      this.http.delete(this.config.apiPath(path), this.addJwt()));
  }

  /**
   * Fetches entities via HTTP GET.
   *
   * @param path Path of the entities relative to the API path, e.g., '/items'.
   * @param criteria Object representing the query.
   * @param offset Zero-based offset of the objects to return.
   * @param limit Maximal number of objects to return.
   * @param returnCount If true, the total number of objects will be returned.
   * @returns {Observable<Object>} JSON result observable
   */
  fetch(path: string, criteria: object, offset?: number, limit?: number, returnCount?: number):
      Observable<any> {
    return this.httpGet(path, this.createSearchParams(criteria, offset, limit, returnCount));
  }

  /**
   * Sends a GET request to the Labels API server.
   *
   * @param path Path relative to the API path.
   * @param params Query parameters
   * @returns {Observable<Object>} JSON result observable
   */
  labelsHttpGet(path: string, params?: {[param: string]: string}): Observable<any> {
    return this.handleHttpResult(
      this.http.get(this.config.labelsApiPath(path), {params: params}));
  }

  /**
   * Sends a POST request to Labels the API server.
   *
   * @param path Path relative to the API path.
   * @param body POST payload
   * @returns {Observable<Object>} JSON result observable
   */
  labelsHttpPost(path: string, body?: any, options?: any): Observable<any> {
    return this.handleHttpResult(this.http.post(
      this.config.labelsApiPath(path), body, options));
  }

  /**
   * Handles an HTTP error response.
   */
  private handleError(response: HttpErrorResponse) {
    if (response.status === 401) {
      // 401 unauthorized response so log user out of client
      this.router.navigate(['/login']);
    }
    return observableThrowError(this.toRpcError(response));
  }

  private toRpcError(response: HttpErrorResponse) {
    const error = response.error;
    return new RpcError(response.status, error.code, "" + error);
  }
}
