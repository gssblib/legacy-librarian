import { Injectable } from '@angular/core';
import { RpcService } from "../../core/rpc.service";
import { Item } from './item';
import { Subject } from "rxjs/Subject";
import { ItemsService } from "./items.service";

/**
 * Manages the single item shown by the item views.
 *
 * All item views watch the observable in this service, and changes to the item
 * (reloading the item from the server) are published to this service.
 */
@Injectable()
export class ItemService {
  /** Current item. */
  private item: Item;

  private itemSubject = new Subject<Item>();
  itemObservable = this.itemSubject.asObservable();

  newItem: Item = new Item();

  constructor(private itemsService: ItemsService) {
    this.itemObservable.subscribe(item => this.item = item);
  }

  getItem(): Item {
    return this.item;
  }

  setItem(item: Item) {
    this.item = item;
    this.itemSubject.next(item);
  }

  loadItem(barcode: string) {
    this.itemsService.get(barcode).subscribe(this.setItem.bind(this))
  }

  reloadItem() {
    if (this.item) {
      this.loadItem(this.item.barcode);
    }
  }
}
