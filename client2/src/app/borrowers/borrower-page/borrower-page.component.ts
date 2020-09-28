import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { formatCurrency } from '@angular/common';
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
    { link: 'orders', label: 'Orders', action: 'borrowers.read' },
    { link: 'profile', label: 'Profile', action: 'borrowers.view' },
    { link: 'history', label: 'History', action: 'borrowers.view' },
  ];

  borrower: Borrower;

  constructor(private borrowerService: BorrowerService,
              private route: ActivatedRoute,
              @Inject(LOCALE_ID) private locale:string) {
    borrowerService.subscribe(borrower => this.setBorrower(borrower));
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.borrowerService.set(data['borrower']));
  }

  private setBorrower(borrower: Borrower) {
    this.borrower = borrower;
    // Update the fee tab title to reflect the total fee amount due.
    var fees = formatCurrency(borrower.fees.total, this.locale, '$');
    this.navLinks[1]['label'] = `Fees (${fees})`;
    delete this.navLinks[1]['class']
    if (borrower.fees.total > 3.0) {
      this.navLinks[1]['class'] = 'warn';
    }
  }
}
