import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../core/authorization.service';
import { Item } from '../shared/item';
import { ItemsService } from '../shared/items.service';
import { ViewFormField } from '../../core/form.service';
import { ItemService } from '../shared/item.service';
import { Router } from "@angular/router";
import { NotificationService } from "../../core/notification-service";

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
              private router: Router,
              private notificationService: NotificationService,
              private authorizationService: AuthorizationService) {
    this.itemsService.getViewFields().subscribe(fields => this.fields = fields);
    this.itemService.subscribe(item => this.item = item);
  }

  onCopy() {
    const newItem = Object.assign(new Item(), this.item);
    newItem.barcode = '';
    newItem.id = undefined;
    this.itemService.newItem = newItem;
    this.router.navigate(['items', 'add']);
  }

  onDelete() {
    const barcode = this.item.barcode;
    this.itemsService.remove(this.item).subscribe(
      item => { this.notificationService.show(`Item ${barcode} deleted.`) },
      error => { this.notificationService.showError("Failed saving item.", error) }
    );
    this.router.navigate(['/items']);
  }

  ngOnInit() {
    this.editable = false;
    this.item = this.itemService.get();
  }
}
