import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../core/authorization.service';
import { Item } from '../shared/item';
import { ItemsService } from '../shared/items.service';
import { ViewFormField } from '../../core/form.service';
import { ItemService } from '../shared/item.service';

@Component({
  selector: 'gsl-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  editable: boolean;
  item: Item;
  fields: ViewFormField[];

  constructor(private itemsService: ItemsService,
              private itemService: ItemService,
              private authorizationService: AuthorizationService) {
    this.editable = authorizationService.isAuthorized('items.update');
    this.itemsService.getViewFields().subscribe(fields => this.fields = fields);
    this.itemService.itemObservable.subscribe(item => this.item = item);
  }

  ngOnInit() {
    this.item = this.itemService.getItem();
  }
}
