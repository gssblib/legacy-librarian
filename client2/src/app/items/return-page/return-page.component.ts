import { Component, OnInit } from '@angular/core';
import { ItemsService } from "../shared/items.service";

@Component({
  selector: 'gsl-return-page',
  templateUrl: './return-page.component.html',
  styleUrls: ['./return-page.component.css']
})
export class ReturnPageComponent implements OnInit {

  constructor(private itemsService: ItemsService) { }

  ngOnInit() {
  }

  returnItem(barcode) {

  }
}
