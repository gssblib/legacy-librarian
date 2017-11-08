import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Borrower } from "../shared/borrower";
import { BorrowersService } from "../shared/borrowers.service";
import { ActivatedRoute } from "@angular/router";
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
    { link: 'checkouts', label: 'Checkouts'},
    { link: 'fees', label: 'Fees'},
    { link: 'profile', label: 'Profile'}
  ];

  borrower: Borrower;

  constructor(
    private currencyPipe: CurrencyPipe,
    private borrowersService: BorrowersService,
    private borrowerService: BorrowerService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.setBorrower(data['borrower']));
  }

  private setBorrower(borrower: Borrower) {
    this.borrower = borrower;
    this.borrowerService.borrower = borrower;
    // Update the fee tab title tot reflect the total fee amount due.
    var fees = this.currencyPipe.transform(borrower.fees.total);
    this.navLinks[1]['label'] = `Fees (${fees})`;
  }
}
