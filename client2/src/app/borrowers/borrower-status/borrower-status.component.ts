import { Component, Input } from '@angular/core';
import { BorrowerState, BorrowerStateLabels } from "../shared/borrower-state";

@Component({
  selector: 'gsl-borrower-status',
  templateUrl: './borrower-status.component.html',
  styleUrls: ['./borrower-status.component.css']
})
export class BorrowerStatusComponent {
  @Input('status') status: BorrowerState;

  constructor() { }

  getStatusLabel(status) {
    return BorrowerStateLabels[status];
  }

}
