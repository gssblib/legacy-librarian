import { Component, OnInit } from '@angular/core';
import { Item } from "../../items/shared/item";
import { ItemsService } from "../../items/shared/items.service";

@Component({
  selector: 'gsl-isbn-assignment-page',
  templateUrl: './isbn-assignment-page.component.html',
  styleUrls: ['./isbn-assignment-page.component.css']
})
export class IsbnAssignmentPageComponent implements OnInit {

  scannedItems: Array<Item>;
  currentItem: Item;

  focusOnBarcode = true;
  focusOnIsbn = false;

  constructor(private itemsService: ItemsService) {
    console.log(this.currentItem);
  }

  ngOnInit() {
  }

  setCurrentItem(barcode) {
      this.itemsService.getItem(barcode).subscribe( item => {
          this.currentItem = item;
          this.focusOnBarcode = false;
          this.focusOnIsbn = true;
      });
  }


}
