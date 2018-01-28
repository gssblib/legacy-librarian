import { Component, Input } from '@angular/core';
import { BorrowerState, BorrowerStateLabels } from "../shared/borrower-state";

const enum Size {
  SMALL = 'small',
  NORMAL = 'normal',
}

@Component({
  selector: 'gsl-borrower-status',
  templateUrl: './borrower-status.component.html',
  styleUrls: ['./borrower-status.component.css']
})
export class BorrowerStatusComponent {
  @Input() status: BorrowerState;
  @Input() size = Size.SMALL;

  /**
   * Router link passed down to the chip.
   *
   * The click events don't bubble up from mat-chip so that we have to
   * set the 'routerLink' property explicitly.
   */
  @Input() routerLink;

  getStatusLabel(status) {
    return BorrowerStateLabels[status];
  }
}
