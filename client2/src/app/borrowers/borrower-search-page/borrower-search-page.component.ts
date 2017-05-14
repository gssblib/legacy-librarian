import { Component, OnInit } from '@angular/core';
import {Borrower} from "../shared/borrower";
import {Router} from "@angular/router";

@Component({
  selector: 'gsl-borrower-search-page',
  templateUrl: './borrower-search-page.component.html',
  styleUrls: ['./borrower-search-page.component.css']
})
export class BorrowerSearchPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  showBorrower(borrower: Borrower) {
    this.router.navigate(['/borrowers', borrower.borrowernumber, 'checkouts']);
  }
}
