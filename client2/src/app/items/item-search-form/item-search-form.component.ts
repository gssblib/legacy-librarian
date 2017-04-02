import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ItemQuery } from "../shared/item-query";

@Component({
  selector: 'gsl-item-search-form',
  templateUrl: './item-search-form.component.html',
  styleUrls: ['./item-search-form.component.css']
})
export class ItemSearchFormComponent implements OnInit {
  @Output()
  search: EventEmitter<ItemQuery> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSubmit(query) {
    console.log('query: ' + JSON.stringify(query));
    this.search.emit(query);
  }
}
