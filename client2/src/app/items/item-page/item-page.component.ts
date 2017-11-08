import { Component, OnInit } from '@angular/core';
import { Item } from "../shared/item";
import { ItemsService } from "../shared/items.service";
import { ItemService } from "../shared/item.service";
import { ActivatedRoute } from "@angular/router";

/**
 * Presents a single Item with its details and history.
 */
@Component({
  selector: 'gsl-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css']
})
export class ItemPageComponent implements OnInit {
  navLinks = [
    { link: 'details', label: 'Details'},
    { link: 'history', label: 'History'},
    { link: 'labels', label: 'Labels'}
  ];

  item: Item;

  constructor(private itemsService: ItemsService,
              private itemService: ItemService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.setItem(data['item']));
  }

  private setItem(item: Item) {
    this.item = item;
    this.itemService.item = item;
  }
}
