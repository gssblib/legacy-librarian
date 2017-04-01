import { Component, OnInit } from '@angular/core';
import { Item } from "../shared/item";
import { ItemsService } from "../shared/items.service";
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
  item: Item;

  constructor(private itemService: ItemsService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.loadItem(params['id']));
  }

  private loadItem(barcode: string) {
    this.itemService.getItem(barcode).subscribe(item => {
      this.item = item;
    });
  }
}
