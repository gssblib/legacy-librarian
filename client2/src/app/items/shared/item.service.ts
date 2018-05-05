import { Injectable } from '@angular/core';
import { Item } from './item';
import { ItemsService } from "./items.service";
import { ModelService } from "../../core/model.service";
import { ItemState } from "./item-state";

/**
 * Manages the single item shown by the item views.
 *
 * All item views watch the observable in this service, and changes to the item
 * (reloading the item from the server) are published to this service.
 */
@Injectable()
export class ItemService extends ModelService<Item> {
  _newItem: Item;

  set newItem(item: Item) {
    const newItem = Object.assign(new Item(), item);
    newItem.state = ItemState.CIRCULATING;
    delete newItem.title;
    delete newItem.antolin;
    delete newItem.isbn10;
    delete newItem.isbn13;
    this._newItem = newItem;
  }

  get newItem(): Item {
    return this._newItem || this.createNewItem();
  }

  private createNewItem(): Item {
    const item = new Item();
    item.state = ItemState.CIRCULATING;
    return item;
  }

  constructor(private itemsService: ItemsService) {
    super(itemsService);
  }
}
