import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormlyFieldConfig } from "@ngx-formly/core";
import { ItemQuery } from "../shared/item-query";
import { ItemsService } from "../shared/items.service";

@Component({
  selector: 'gsl-item-search-form',
  templateUrl: './item-search-form.component.html',
  styleUrls: ['./item-search-form.component.css']
})
export class ItemSearchFormComponent implements OnInit {
  @Input()
  criteria: any = {};

  @Input('fields')
  shownFields: string[] = ['title', 'author', 'description'];

  @Output()
  search: EventEmitter<ItemQuery> = new EventEmitter();

  fields: Array<FormlyFieldConfig> = [];

  constructor(
    private itemsService: ItemsService,
  ) { }

  ngOnInit() {
    this.itemsService.getItemFields().subscribe(
      fields => {
        this.fields = fields
          .filter(field => this.shownFields.includes(field.key))
          .sort((f1, f2) => this.shownFields.indexOf(f1.key) - this.shownFields.indexOf(f2.key));
      }
    );
  }

  onSubmit(query) {
    console.log('query: ' + JSON.stringify(query));
    this.search.emit(this.toCriteria(query));
  }

  onReset() {
    this.criteria = {};
  }

  private toCriteria(query) {
    const criteria: any = {};
    for (let field of this.shownFields) {
      if (query[field] !== '') {
        criteria[field] = query[field];
      }
    }
    return criteria;
  }

}
