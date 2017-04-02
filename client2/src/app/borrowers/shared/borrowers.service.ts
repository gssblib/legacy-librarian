import { Injectable } from '@angular/core';
import { ConfigService } from "../../core/config.service";
import { Http } from "@angular/http";
import { RpcService } from "../../core/rpc.service";
import { Observable } from "rxjs";
import { Borrower } from "./Borrower";
import { FetchResult } from "../../core/fetch-result";

@Injectable()
export class BorrowersService {

  constructor(private config: ConfigService, private http: Http, private rpc: RpcService) {
  }

  /**
   * Gets a single Borrower identified by id (borrowernumber).
   */
  getBorrower(id: string): Observable<Borrower> {
    return this.http.get(this.config.apiPath('borrowers/' + id))
      .map(this.rpc.getData)
      .catch(this.rpc.handleError);
  }

  getBorrowers(criteria, offset, limit, returnCount): Observable<FetchResult> {
    return this.rpc.fetch('borrowers', criteria, offset, limit, returnCount);
  }
}
