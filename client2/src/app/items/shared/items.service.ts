import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import { Item } from "./item";
import { RpcService } from "../../core/rpc.service";
import { FetchResult } from "../../core/fetch-result";
import { TableFetchResult } from "../../core/table-fetcher";
import { ItemState } from "./item-state";
import { Column, FormService, ViewFormField } from '../../core/form.service';
import { FormlyFieldConfig } from "@ngx-formly/core";

/**
 * Service for fetching and manipulating items.
 */
@Injectable()
export class ItemsService {
  /** Cached columns fetched from server. */
  private cols: Column[];

  constructor(private rpc: RpcService, private formService: FormService) {
  }

  private arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  getColumns(): Observable<Column[]> {
    return this.cols
      ? Observable.of(this.cols)
      : this.rpc.httpGet('items/fields').do(cols => this.cols = cols);
  }

  /**
   * Returns the formly form fields for the borrower details page.
   *
   * @param selected Keys of the fields to return (in this order)
   */
  getItemFields(selected?: string[]): Observable<FormlyFieldConfig[]> {
    return this.getColumns().map(cols => this.formService.formlyFields(cols, selected));
  }

  getViewFields(selected?: string[]): Observable<ViewFormField[]> {
    return this.getColumns().map(cols => this.formService.viewFormFields(cols, selected));
  }

  /**
   * Gets a single Item identified by barcode.
   */
  getItem(barcode: string, params?: any): Observable<Item> {
    return this.rpc.httpGet('items/' + barcode, params)
      .map(obj => Object.assign(new Item(), obj));
  }

  getItems(criteria, offset, limit, returnCount): Observable<TableFetchResult<Item>> {
    return this.rpc.fetch('items', criteria, offset, limit, returnCount)
      .map(this.fetchResultToItemResult.bind(this));
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

  renewItem(barcode: string): Observable<any> {
    return this.rpc.httpPost(`items/${barcode}/renew`);
  }

  addItem(item): Observable<Item> {
    const storedItem = Object.assign({}, item);
    return this.rpc.httpPost('items', storedItem)
      .map(obj => Object.assign(new Item(), obj));
  }

  saveItem(item) {
    const storedItem = Object.assign({}, item);
    storedItem.added = undefined; // datetime not handled yet
    return this.rpc.httpPut('items', storedItem)
      .map(obj => Object.assign(new Item(), obj));
  }

  deleteItem(item) {
    return this.rpc.httpDelete(`items/${item.barcode}`);
  }

  deleteCover(item) {
    return this.rpc.httpDelete(`items/${item.barcode}/cover`);
  }

  getLabelCategories(item): Observable<any> {
    return this.rpc.labelsHttpGet(item.barcode + '/categories')
      .map(obj => obj.categories);
  }

  getLabelCategoryFields(item, category): Observable<any> {
    return this.rpc.labelsHttpGet(item.barcode + '/' + category + '/details')
      .map(obj => obj.fields);
  }

  getLabelPreviewImage(item, category, data): Observable<any> {
    return this.rpc.labelsHttpPost(
      item.barcode + '/' + category + '/preview', data, {
        responseType: 'arraybuffer'
      })
      .map(image => this.arrayBufferToBase64(image));
  }

  printLabel(item, category, data): Observable<any> {
    return this.rpc.labelsHttpPost(
      item.barcode + '/' + category + '/print', data);
  }
}
