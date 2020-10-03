import { Component, Input } from '@angular/core';
import { Availability, getAvailabilityLabel } from "../shared/item-status";

const enum Size {
  SMALL = 'small',
  NORMAL = 'normal',
}

@Component({
  selector: 'gsl-item-availability',
  templateUrl: './item-availability.component.html',
  styleUrls: ['./item-availability.component.css']
})
export class ItemAvailabilityComponent {

  @Input('availability') availability: Availability;
  @Input('size') size = Size.SMALL;

  get label(): string {
    return getAvailabilityLabel(this.availability);
  }
}
