import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Item } from "./item";
import { RpcService } from "../../core/rpc.service";
import { FetchResult } from "../../core/fetch-result";
import { TableFetchResult, TablePageFetcher, TablePageRequest } from "../../core/table-fetcher";
import { ItemState } from "./item-state";
import { FormService } from "../../core/form.service";
import { FormlyFieldConfig } from "@ngx-formly/core";

/**
 * Service for fetching and manipulating items.
 */
@Injectable()
export class ItemsService {

  constructor(private rpc: RpcService, private formService: FormService) {
  }

  getItemFields(): Observable<Array<FormlyFieldConfig>> {
    return this.rpc.httpGet('items/fields')
      .map((cols: any) => this.formService.formlyFields(cols));
  }

  /**
   * Gets a single Item identified by barcode.
   */
  getItem(barcode: string): Observable<Item> {
    return this.rpc.httpGet('items/' + barcode)
      .map(obj => Object.assign(new Item(), obj));
  }

  getItems(criteria, offset, limit, returnCount): Observable<TableFetchResult<Item>> {
    return this.rpc.fetch('items', criteria, offset, limit, returnCount)
      .map(this.fetchResultToItemResult.bind(this));
  }

  getItemsFetcher(criteria): TablePageFetcher<Item> {
    return (query: TablePageRequest) => {
      const params: any = { ...criteria };
      if (query.sortOrder) {
        params._order = query.sortOrder;
      }
      return this.getItems(
        criteria, query.offset, query.limit, true).map(
        result => new TableFetchResult(result.rows, result.count));
    };
  }

  rowToItem(row: Object): Item {
    const item = Object.assign(new Item(), row);
    if (typeof item.state === 'string') {
      item.state = ItemState[<string> item.state];
    }
    return item;
  }

  rowsToItems(rows: Object[]): Item[] {
    return rows.map(this.rowToItem);
  }

  fetchResultToItemResult(result: FetchResult): TableFetchResult<Item> {
    return new TableFetchResult(this.rowsToItems(result.rows), result.count);
  }

  returnItem(barcode: string): Observable<any> {
    return this.rpc.httpPost(`items/${barcode}/checkin`);
  }

  saveItem(item) {
    console.log("storing item: ", item);
    const storedItem = Object.assign({}, item);
    storedItem.added = undefined; // datetime not handled yet
    return this.rpc.httpPut('/items', storedItem);
  }
}

