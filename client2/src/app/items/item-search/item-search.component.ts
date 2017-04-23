import { Component, OnInit } from '@angular/core';
import { Item } from "../shared/item";
import { ItemsService } from "../shared/items.service";
import {TablePageFetcher} from "../../core/table-fetcher";

/**
 * Presents the search form for Items.
 */
@Component({
  selector: 'gsl-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css']
})
export class ItemSearchComponent implements OnInit {
  fetcher: TablePageFetcher<Item>;

  constructor(private itemsService: ItemsService) {
  }

  ngOnInit() {
  }

  search(criteria) {
    this.fetcher = this.itemsService.getItemsFetcher(criteria);
  }
}
