import { Injectable } from '@angular/core';
import { Response } from "@angular/http";
import { Observable } from "rxjs";

/**
 * Support for RPC (REST over HTTP) calls.
 */
@Injectable()
export class RpcService {

  constructor() {
  }

  /**
   * Returns the JSON object contained in the response.
   *
   * The REST currently does not wrap the data inside of the response payload. We
   * may add this wrapper in the future in which case we can update just this function.
   */
  extractData(res: Response) {
    let body = res.json();
    return body || {};
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
