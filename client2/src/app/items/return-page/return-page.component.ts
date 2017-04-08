import { Component, OnInit } from '@angular/core';
import { ItemsService } from "../shared/items.service";
import {Item} from "../shared/item";

@Component({
  selector: 'gsl-return-page',
  templateUrl: './return-page.component.html',
  styleUrls: ['./return-page.component.css']
})
export class ReturnPageComponent implements OnInit {
  returnedItems: Item[];

  constructor(private itemsService: ItemsService) { }

  ngOnInit() {
    this.returnedItems = [];
  }

  returnItem(barcode) {
    console.log('return item: ' + barcode);
    this.itemsService.returnItem(barcode).subscribe(item => {
      this.returnedItems.push(item);
    });
  }
}
