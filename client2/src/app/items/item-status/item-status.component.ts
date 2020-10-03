import { Component, Input } from '@angular/core';
import { getItemStatusLabel, ItemStatus } from '../shared/item-status';

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

  @Input('status') status: ItemStatus;
  @Input('size') size = Size.SMALL;

  get name(): string {
    return this.status.toLowerCase();
  }

  get label(): string {
    return getItemStatusLabel(this.status);
  }
}
