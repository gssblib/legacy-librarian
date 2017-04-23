import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { ConfigService } from "../../core/config.service";
import { Observable } from "rxjs";
import { Item } from "./item";
import { RpcService } from "../../core/rpc.service";
import { FetchResult } from "../../core/fetch-result";
import {TablePageFetcher, TablePageRequest, TableFetchResult} from "../../core/table-fetcher";

/**
 * Service for fetching and manipulating items.
 */
@Injectable()
export class ItemsService {

  constructor(private config: ConfigService, private http: Http, private rpc: RpcService) {
  }

  /**
   * Gets a single Item identified by barcode.
   */
  getItem(barcode: string): Observable<Item> {
    return this.http.get(this.config.apiPath('items/' + barcode))
      .map(this.rpc.getData)
      .catch(this.rpc.handleError);
  }

  getItems(criteria, offset, limit, returnCount): Observable<FetchResult> {
    return this.rpc.fetch('items', criteria, offset, limit, returnCount);
  }

  getItemsFetcher(criteria): TablePageFetcher<Item> {
    return (query: TablePageRequest) => {
      const params = { ...criteria };
      if (query.sortOrder) {
        params._order = query.sortOrder;
      }
      return this.getItems(
        criteria, query.offset, query.limit, true).map(
        result => new TableFetchResult(result.rows, result.count));
    };
  }

  returnItem(barcode: string) {
    return this.http.post(this.config.apiPath(`items/${barcode}/checkin`), 'foo')
      .map(this.rpc.getData)
      .catch(this.rpc.handleError);
  }
}

