import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { ItemsService } from "../shared/items.service";
import { Item } from "../shared/item";

@Component({
  selector: 'gsl-item-add-page',
  templateUrl: './item-add-page.component.html',
  styleUrls: ['./item-add-page.component.css']
})
export class ItemAddPageComponent implements OnInit {
  form = new FormGroup({});
  item = {};
  fields: Array<FormlyFieldConfig> = [];

  constructor(
    private itemsService: ItemsService,
    private router: Router) { }

  ngOnInit() {
    this.itemsService.getItemFields().subscribe(fields => this.fields = fields);
  }

  submitForm(item) {
    this.itemsService.addItem(item).subscribe(
      value => {
        this.router.navigate(['/items', value.barcode]);
      },
      error => { console.log("error saving item: " + error)}
    );
  }

}
