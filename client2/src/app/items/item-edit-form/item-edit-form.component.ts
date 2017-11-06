import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { ItemsService } from "../shared/items.service";

@Component({
  selector: "gsl-item-edit-form",
  templateUrl: "./item-edit-form.component.html",
  styleUrls: ["./item-edit-form.component.css"],
  inputs: ['item'],
})
export class ItemEditFormComponent implements OnInit {
  form = new FormGroup({});
  item = null;
  fields: Array<FormlyFieldConfig> = [];

  constructor(private itemsService: ItemsService) {}

  ngOnInit(): void {
    this.itemsService.getItemFields().subscribe(fields => this.fields = fields);
  }

  submit(item) {
    this.itemsService.saveItem(this.item).subscribe(
      value => { console.log("saved item"); },
      error => { console.log("error saving item: " + error)}
    );
  }
}
