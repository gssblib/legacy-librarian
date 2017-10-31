import { Component, OnInit } from '@angular/core';
import { Borrower } from "../shared/borrower";
import { BorrowerService } from "../shared/borrower.service";

/**
 * Presents a borrowers names and contact information.
 */
@Component({
  selector: 'gsl-borrower-profile',
  templateUrl: './borrower-profile.component.html',
  styleUrls: ['./borrower-profile.component.css']
})
export class BorrowerProfileComponent implements OnInit {
  borrower: Borrower = null;

  constructor(private borrowerService: BorrowerService) {
  }

  ngOnInit() {
    this.borrower = this.borrowerService.borrower;
  }
}
