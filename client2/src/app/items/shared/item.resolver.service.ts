import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Item } from './item';
import { Injectable } from '@angular/core';
import { ItemsService } from './items.service';

@Injectable()
export class ItemResolverService implements Resolve<Item> {
  constructor(private itemsService: ItemsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item> {
    const id = route.params['id'];
    return this.itemsService.getItem(id);
  }
}
