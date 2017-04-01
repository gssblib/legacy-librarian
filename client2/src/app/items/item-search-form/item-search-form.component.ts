import { Component, OnInit } from '@angular/core';
import { ItemQuery } from "../shared/item-query";

@Component({
  selector: 'gsl-item-search-form',
  templateUrl: './item-search-form.component.html',
  styleUrls: ['./item-search-form.component.css']
})
export class ItemSearchFormComponent implements OnInit {
  query: ItemQuery = new ItemQuery();

  constructor() { }

  ngOnInit() {

  }

}
