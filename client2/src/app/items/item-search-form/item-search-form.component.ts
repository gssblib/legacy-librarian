import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemQuery } from "../shared/item-query";

@Component({
  selector: 'gsl-item-search-form',
  templateUrl: './item-search-form.component.html',
  styleUrls: ['./item-search-form.component.css']
})
export class ItemSearchFormComponent implements OnInit {
  @Input()
  criteria: Object;

  @Output()
  search: EventEmitter<ItemQuery> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSubmit(query) {
    console.log('query: ' + JSON.stringify(query));
    this.search.emit(this.toCriteria(query));
  }

  private toCriteria(query) {
    const criteria: any = {};
    for (let field of ['title', 'author']) {
      if (query[field] !== '') {
        criteria[field] = query[field];
      }
    }
    return criteria;
  }

}
