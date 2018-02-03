import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { Router } from "@angular/router";
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
    this.itemsService.getFormlyFields().subscribe(fields => this.fields = fields);
    this.itemService.subscribe(item => this.item = item);
    this.item = this.itemService.getItem();
  }

  ngOnInit(): void {
    this.item = this.itemService.getItem();
  }

  submit() {
    this.itemsService.save(this.item).subscribe(
      item => this.onSaved(item),
      error => { this.notificationService.showError("Failed saving item.", error)}
    );
  }

  copy() {
    const newItem = Object.assign(new Item(), this.item);
    newItem.barcode = '';
    newItem.id = undefined;
    this.itemService.newItem = newItem;
    this.router.navigate(['items', 'add']);
  }

  delete() {
    const barcode = this.item.barcode;
    this.itemsService.remove(this.item).subscribe(
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
