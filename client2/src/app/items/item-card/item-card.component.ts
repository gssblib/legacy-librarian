import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from "../../core/config.service";
import { Item } from "../shared/item";
import { ItemState } from "../shared/item-state";

@Component({
  selector: 'gsl-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {
  @Input('item') item: Item;

  ItemState = ItemState;

  hasCover: boolean = true;

  constructor(
    private config: ConfigService,
  ) { }

  ngOnInit() {
  }

  noCover() {
    this.hasCover = false;
  }
}
