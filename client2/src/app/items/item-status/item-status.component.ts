import { Component, Input } from '@angular/core';
import { Item } from "../shared/item";

@Component({
  selector: 'gsl-item-status',
  templateUrl: './item-status.component.html',
  styleUrls: ['./item-status.component.css']
})
export class ItemStatusComponent {
  @Input('item') item: Item;
  status: string;
  statusClass: string;

  constructor() { }

  getStatus(state, checkout) {
    if (state != 'CIRCULATING') {
      this.status = 'Unavailable';
      return 'unavailable';
    }
    if (state == 'CIRCULATING' && checkout) {
      return 'checkedout';
    }
    if (state == 'CIRCULATING' && !checkout) {
      return 'available';
    }
  }

  getStatusClass(state, checkout) {
    return this.getStatus(state, checkout);
  }

  getStatusTitle(state, checkout) {
    var status = this.getStatus(state, checkout);
    if (status == 'unavailable') {
      return 'Unavailable';
    }
    if (status == 'checkedout') {
      return 'Checked Out';
    }
    if (status == 'available') {
      return 'Available';
    }
  }
}
