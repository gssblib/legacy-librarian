import { Component, Input } from '@angular/core';
import { Item } from "../shared/item";
import { ItemState, ItemStateLabels } from "../shared/item-state";

@Component({
  selector: 'gsl-item-status',
  templateUrl: './item-status.component.html',
  styleUrls: ['./item-status.component.css']
})
export class ItemStatusComponent {
  @Input('status') status: ItemState;

  constructor() { }

  getStatusLabel(status) {
    return ItemStateLabels[status];
  }
}
