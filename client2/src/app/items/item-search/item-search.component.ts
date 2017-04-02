import { Component, OnInit } from '@angular/core';
import { Item } from "../shared/item";
import { ItemsService } from "../shared/items.service";

/**
 * Presents the search form for Items.
 */
@Component({
  selector: 'gsl-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css']
})
export class ItemSearchComponent implements OnInit {
  items: Item[];

  constructor(private itemsService: ItemsService) {
  }

  ngOnInit() {
    this.items = [];
  }

  search(query) {
    const criteria = this.toCriteria(query);
    this.itemsService.getItems(criteria, 0, 20, true).subscribe(
      fetchResult => {
        this.items = fetchResult.rows;
        console.log('items: ' + JSON.stringify(this.items));
      }
    );
  }

  private toCriteria(query) {
    const criteria: any = {};
    if (query.title !== '') {
      criteria.title = query.title;
    }
    return criteria;
  }
}
