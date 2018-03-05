import { Component, OnInit } from '@angular/core';
import {Borrower} from "../shared/borrower";
import {Router} from "@angular/router";

@Component({
  selector: 'gsl-borrower-search-bar',
  templateUrl: './borrower-search-bar.component.html',
  styleUrls: ['./borrower-search-bar.component.css']
})
export class BorrowerSearchBarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  showBorrower(borrower: Borrower) {
    this.router.navigate(['/borrowers', borrower.borrowernumber, 'checkouts']);
  }
}
