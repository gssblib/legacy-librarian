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
  @Input('status') status: BorrowerState;
  @Input('size') size = Size.SMALL;

  constructor() { }

  getStatusLabel(status) {
    return BorrowerStateLabels[status];
  }

}
