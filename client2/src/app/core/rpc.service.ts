import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { ConfigService } from "./config.service";
import { FetchResult } from "./fetch-result";

/**
 * Support for RPC (REST over HTTP) calls.
 */
@Injectable()
export class RpcService {
  constructor(private config: ConfigService, private http: Http) {
  }

  /**
   * Returns the JSON object contained in the response.
   */
  getData(response: Response) {
    const body = response.json() || {};
    return body.data || body;
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

  httpGet(path: string, params: object) {
    return this.http.get(this.config.apiPath(path), {params: params}).map(this.getData);
  }

  fetch(path: string, criteria: object, offset?: number, limit?: number, returnCount?: number):
      Observable<FetchResult> {
    return this.httpGet(path, this.createSearchParams(criteria, offset, limit, returnCount));
  }

  /**
   * Handles an HTTP error response.
   */
  handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
