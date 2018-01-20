import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Borrower } from '../shared/borrower';
import { ActivatedRoute } from '@angular/router';
import { BorrowerService } from '../shared/borrower.service';

/**
 * Presents all the information of a borrower (checkouts, fees, history, profile).
 */
@Component({
  selector: 'gsl-borrower-page',
  templateUrl: './borrower-page.component.html',
  styleUrls: ['./borrower-page.component.css']
})
export class BorrowerPageComponent implements OnInit {
  navLinks = [
    { link: 'checkouts', label: 'Checkouts', action: 'borrowers.read' },
    { link: 'fees', label: 'Fees', action: 'borrowers.payFees' },
    { link: 'profile', label: 'Profile', action: 'borrowers.view' },
    { link: 'history', label: 'History', action: 'borrowers.view' },
  ];

  borrower: Borrower;

  constructor(
    private currencyPipe: CurrencyPipe,
    private borrowerService: BorrowerService,
    private route: ActivatedRoute) {
    borrowerService.borrowerObservable.subscribe(this.setBorrower.bind(this));
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      data => this.borrowerService.setBorrower(data['borrower']));
  }

  private setBorrower(borrower: Borrower) {
    this.borrower = borrower;
    // Update the fee tab title tot reflect the total fee amount due.
    var fees = this.currencyPipe.transform(borrower.fees.total);
    this.navLinks[1]['label'] = `Fees (${fees})`;
    delete this.navLinks[1]['class']
    if (borrower.fees.total > 3.0) {
      this.navLinks[1]['class'] = 'warn';
    }
  }
}
