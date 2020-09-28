import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { Router } from "@angular/router";
import { NotificationService } from "../../core/notification-service";
import { ItemService } from "../shared/item.service";
import { ItemsService } from "../shared/items.service";
import { Item } from "../shared/item";
import { RpcError } from "../../core/rpc-error";


@Component({
  selector: "gsl-item-edit-form",
  templateUrl: "./item-edit-form.component.html",
  styleUrls: ["./item-edit-form.component.css"],
})
export class ItemEditFormComponent implements OnInit {
  form = new FormGroup({});
  item: Item;
  fields: Array<FormlyFieldConfig> = [];

  @Output()
  readonly done = new EventEmitter();

  constructor(private router: Router,
              private notificationService: NotificationService,
              private itemsService: ItemsService,
              private itemService: ItemService) {
    this.itemsService.getFormlyFields().subscribe(fields => this.fields = fields);
    this.itemService.subscribe(item => this.item = item);
    this.item = this.itemService.get();
  }

  ngOnInit(): void {
    this.item = this.itemService.get();
  }

  submit() {
    this.itemsService.save(this.item).subscribe(
      item => {
        this.notificationService.show("Item saved.");
        this.done.next();
      },
      error => this.notificationService.showError("Failed to save item: " + this.toErrorMessage(error)));
  }

  onCancel() {
    this.done.emit();
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
