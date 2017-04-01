import { Component, OnInit } from '@angular/core';

/**
 * Presents the search form for Items.
 */
@Component({
  selector: 'gsl-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css']
})
export class ItemSearchComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  showItem(item) {
    console.log('show item: ' + item.title);
  }
}
