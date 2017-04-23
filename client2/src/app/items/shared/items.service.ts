import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { ConfigService } from "../../core/config.service";
import { Observable } from "rxjs";
import { Item } from "./item";
import { RpcService } from "../../core/rpc.service";
import { FetchResult } from "../../core/fetch-result";
import {TableFetcher, TableFetchQuery, TableFetchResult} from "../../core/table-fetcher";

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

  getItemsFetcher(criteria): TableFetcher<Item> {
    return new ItemsFetcher(this, criteria);
  }

  returnItem(barcode: string) {
    return this.http.post(this.config.apiPath(`items/${barcode}/checkin`), 'foo')
      .map(this.rpc.getData)
      .catch(this.rpc.handleError);
  }
}

class ItemsFetcher implements TableFetcher<Item> {
  constructor(private itemsService: ItemsService, private criteria) {}

  fetch(query: TableFetchQuery): Observable<TableFetchResult<Item>> {
    const criteria = { ...this.criteria };
    if (query.sortOrder) {
      criteria._order = query.sortOrder;
    }
    return this.itemsService.getItems(
      criteria, query.offset, query.limit, true).map(
        result => new TableFetchResult(result.rows, result.count));
  }
}
