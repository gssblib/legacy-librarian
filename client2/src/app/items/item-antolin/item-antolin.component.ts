import { Component, Input } from '@angular/core';
import { Item } from "../shared/item";

@Component({
  selector: 'gsl-item-antolin',
  templateUrl: './item-antolin.component.html',
  styleUrls: ['./item-antolin.component.css']
})
export class ItemAntolinComponent {
  @Input('item') item: Item;

  constructor() { }

}
