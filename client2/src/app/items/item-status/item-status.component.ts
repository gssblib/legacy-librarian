import { Component, Input } from '@angular/core';
import { getItemStateLabel, ItemState } from '../shared/item-state';

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

  get name(): string {
    return ItemState[this.status].toLowerCase();
  }

  get label(): string {
    return getItemStateLabel(this.status);
  }
}
