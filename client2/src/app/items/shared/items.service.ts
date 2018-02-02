import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import { Item } from "./item";
import { RpcService } from "../../core/rpc.service";
import { FormService } from '../../core/form.service';
import { Borrower } from '../../borrowers/shared/borrower';
import { ModelsService } from "../../core/models.service";

/**
 * Service for fetching and manipulating items.
 */
@Injectable()
export class ItemsService extends ModelsService<Item> {
  constructor(rpc: RpcService, formService: FormService) {
    super('items', item => item.barcode, rpc, formService);
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

  toModel(row: any): Item {
    const item = Object.assign(new Item(), row);
    if (item.borrower) {
      item.borrower = Object.assign(new Borrower(), item.borrower);
    }
    return item;
  }

  returnItem(barcode: string): Observable<any> {
    return this.rpc.httpPost(`items/${barcode}/checkin`);
  }

  renewItem(barcode: string): Observable<any> {
    return this.rpc.httpPost(`items/${barcode}/renew`);
  }

  beforeSave(item: Item) {
    item.added = undefined; // datetime not handled yet
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
