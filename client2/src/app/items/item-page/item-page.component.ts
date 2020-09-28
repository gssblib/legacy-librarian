import { Component, OnInit } from '@angular/core';
import { Item } from '../shared/item';
import { ItemsService } from '../shared/items.service';
import { ItemService } from '../shared/item.service';
import { ActivatedRoute } from '@angular/router';

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
    {link: 'details', label: 'Details', action: 'items.read'},
    {link: 'history', label: 'History', action: 'items.read'},
    {link: 'labels', label: 'Labels', action: 'items.update'}
  ];

  item: Item;

  constructor(private readonly itemsService: ItemsService,
              private readonly itemService: ItemService,
              private readonly route: ActivatedRoute) {
    this.item = this.itemService.get();
    this.itemService.subscribe(item => this.item = item);
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.itemService.set(data['item']));
  }
}
