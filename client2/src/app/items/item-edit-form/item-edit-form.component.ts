import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
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
    private itemsService: ItemsService,
    private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemsService.getItemFields().subscribe(fields => this.fields = fields);
    this.item = this.itemService.item;
  }

  submit(item) {
    this.itemsService.saveItem(this.item).subscribe(
      value => { console.log("saved item"); },
      error => { console.log("error saving item: " + error)}
    );
  }
}
