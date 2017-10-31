import { Component, OnInit } from '@angular/core';
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

  constructor(private borrowersService: BorrowersService,
              private borrowerService: BorrowerService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.setBorrower(data['borrower']));
  }

  private setBorrower(borrower: Borrower) {
    this.borrower = borrower;
    this.borrowerService.borrower = borrower;
  }

  private reloadBorrower() {
    if (this.borrower) {
      this.loadBorrower(this.borrower.borrowernumber);
    }
  }

  private loadBorrower(id: number) {
    this.borrowersService.getBorrower(id, {options: 'items,fees'}).subscribe(borrower => {
      this.borrower = borrower;
      this.borrowerService.borrower = borrower;
    });
  }
}
