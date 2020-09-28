import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { NotificationService } from "../../core/notification-service";
import { ItemsService } from "../shared/items.service";
import { Item } from "../shared/item";
import { ItemService } from "../shared/item.service";
import { RpcError } from "../../core/rpc-error";

/**
 * Page for adding a new item.
 */
@Component({
  selector: 'gsl-item-add-page',
  templateUrl: './item-add-page.component.html',
  styleUrls: ['./item-add-page.component.css']
})
export class ItemAddPageComponent implements OnInit {
  form = new FormGroup({});
  item: Item;
  fields: Array<FormlyFieldConfig> = [];

  constructor(private readonly notificationService: NotificationService,
              private readonly itemsService: ItemsService,
              private readonly itemService: ItemService,
              private readonly router: Router) {
  }

  ngOnInit() {
    this.itemsService.getFormlyFields().subscribe(fields => {
      this.fields = fields
    });
    this.item = this.itemService.newItem;
  }

  submitForm(item) {
    this.itemsService.add(item).subscribe(
      (item: Item) => this.router.navigate(['/items', item.barcode, 'details']),
      (error: RpcError) => this.notificationService.showError(this.toErrorMessage(error)));
  }

  private toErrorMessage(error: RpcError) {
    switch (error.errorCode) {
      case 'ER_DUP_ENTRY':
        return `Item with barcode '${this.item.barcode}' already exists`;
      default:
        return `Server error: ${error.errorCode}`;
    }
  }
}
