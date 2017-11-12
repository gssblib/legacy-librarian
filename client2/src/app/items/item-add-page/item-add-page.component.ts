import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { NotificationService } from "../../core/notification-service";
import { ItemsService } from "../shared/items.service";
import { Item } from "../shared/item";
import { ItemService } from "../shared/item.service";

@Component({
  selector: 'gsl-item-add-page',
  templateUrl: './item-add-page.component.html',
  styleUrls: ['./item-add-page.component.css']
})
export class ItemAddPageComponent implements OnInit {
  form = new FormGroup({});
  item: Item;
  fields: Array<FormlyFieldConfig> = [];

  constructor(
    private notificationService: NotificationService,
    private itemsService: ItemsService,
    private itemService: ItemService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.itemsService.getItemFields().subscribe(fields => {
      this.fields = fields
    });
    this.item = this.itemService.newItem;
  }

  submitForm(item) {
    console.log('add item: ', item);
    // this.itemsService.addItem(item).subscribe(
    //   value => {
    //     this.router.navigate(['/items', value.barcode]);
    //   },
    //   error => {
    //     this.notificationService.showError('Failed to add item.', error)
    //   }
    // );
  }
}
