import { Component, OnInit } from '@angular/core';
import { Item } from "../shared/item";

/**
 * Presents the basic information of a single Item.
 */
@Component({
  selector: 'gsl-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  inputs: ['item']
})
export class ItemComponent implements OnInit {
  item: Item;

  constructor() { }

  ngOnInit() {
  }
}
