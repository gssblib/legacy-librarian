import { Component, OnInit } from '@angular/core';
import { Item } from "../shared/item";
import { ItemsService } from "../shared/items.service";
import { ItemService } from "../shared/item.service";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

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
    { link: 'details', label: 'Details', action: 'items.read'},
    { link: 'history', label: 'History', action: 'items.read'},
    { link: 'labels', label: 'Labels', action: 'items.update'}
  ];

  item: Item;

  constructor(private itemsService: ItemsService,
              private itemService: ItemService,
              private route: ActivatedRoute,
              private router: Router) {
    this.item = this.itemService.getItem();
    this.itemService.itemObservable.subscribe(item => this.item = item );
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.itemService.setItem(data['item']));
  }

  copyItem() {
    console.log('copy item');
    const newItem = Object.assign(new Item(), this.item);
    newItem.barcode = '';
    newItem.id = undefined;
    this.itemService.newItem = newItem;
    this.router.navigate(['items', 'add']);
  }
}
