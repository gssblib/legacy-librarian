import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Item } from './item';
import { Injectable } from '@angular/core';
import { ItemsService } from './items.service';
import { ItemService } from "./item.service";

@Injectable()
export class ItemResolverService implements Resolve<Item> {
  constructor(private itemsService: ItemsService, private itemService: ItemService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
      Observable<Item>|Item {
    const barcode = route.params['id'];
    const item = this.itemService.getItem();
    return item && item.barcode === barcode ? item : this.itemsService.get(barcode);
  }
}
