import { Component, OnInit } from '@angular/core';
import { Borrower } from "../shared/Borrower";
import { BorrowersService } from "../shared/borrowers.service";
import { ActivatedRoute } from "@angular/router";

/**
 * Presents all the information of a borrower (checkouts, fees, history, profile).
 */
@Component({
  selector: 'gsl-borrower-page',
  templateUrl: './borrower-page.component.html',
  styleUrls: ['./borrower-page.component.css']
})
export class BorrowerPageComponent implements OnInit {

  borrower: Borrower;

  constructor(private borrowersService: BorrowersService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.loadBorrower(params['id']));
  }

  private reloadBorrower() {
    if (this.borrower) {
      this.loadBorrower(this.borrower.borrowernumber);
    }
  }

  private loadBorrower(id: number) {
    this.borrowersService.getBorrower(id, {options: 'items,fees'}).subscribe(borrower => {
      this.borrower = borrower;
    });
  }
}
