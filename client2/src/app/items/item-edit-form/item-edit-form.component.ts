import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NotificationService } from "../../core/notification-service";
import { ItemService } from "../shared/item.service";
import { ItemsService } from "../shared/items.service";
import { Item } from "../shared/item";


@Component({
  selector: "gsl-item-edit-form",
  templateUrl: "./item-edit-form.component.html",
  styleUrls: ["./item-edit-form.component.css"],
})
export class ItemEditFormComponent implements OnInit {
  form = new FormGroup({});
  item: Item;
  fields: Array<FormlyFieldConfig> = [];

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private itemsService: ItemsService,
    private itemService: ItemService) {
    this.itemsService.getItemFields().subscribe(fields => this.fields = fields);
    this.itemService.itemObservable.subscribe(item => this.item = item);
    this.item = this.itemService.getItem();
  }

  ngOnInit(): void {
    this.item = this.itemService.getItem();
  }

  submit() {
    this.itemsService.saveItem(this.item).subscribe(
      item => this.onSaved(item),
      error => { this.notificationService.showError("Failed saving item.", error)}
    );
  }

  delete() {
    const barcode = this.item.barcode;
    this.itemsService.deleteItem(this.item).subscribe(
      item => { this.notificationService.show(`Item ${barcode} deleted.`) },
      error => { this.notificationService.showError("Failed saving item.", error) }
    );
    this.router.navigate(['/items']);
  }

  private onSaved(item: Item) {
    this.notificationService.show("Item save.");
    this.itemService.reloadItem();
  }
}
