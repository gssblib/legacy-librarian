import { Component, Input } from '@angular/core';
import { ItemState, ItemStateLabels } from "../shared/item-state";

const enum Size {
  SMALL = 'small',
  NORMAL = 'normal',
}

@Component({
  selector: 'gsl-item-status',
  templateUrl: './item-status.component.html',
  styleUrls: ['./item-status.component.css']
})
export class ItemStatusComponent {

  @Input('status') status: ItemState;
  @Input('size') size = Size.SMALL;

  constructor() { }

  getStatusLabel(status) {
    return ItemStateLabels[status];
  }
}
