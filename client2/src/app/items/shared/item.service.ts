import { Injectable } from '@angular/core';
import { Item } from './item';
import { ItemsService } from "./items.service";
import { ModelService } from "../../core/model.service";

/**
 * Manages the single item shown by the item views.
 *
 * All item views watch the observable in this service, and changes to the item
 * (reloading the item from the server) are published to this service.
 */
@Injectable()
export class ItemService extends ModelService<Item> {
  newItem: Item;

  constructor(private itemsService: ItemsService) {
    super(itemsService);
  }

  getItem(): Item {
    return this.get();
  }

  setItem(item: Item) {
    return this.set(item);
  }

  loadItem(barcode: string) {
    return this.load(barcode);
  }

  reloadItem() {
    return this.reload();
  }
}
