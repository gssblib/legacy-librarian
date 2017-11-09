import { Component, OnInit } from '@angular/core';
import { Borrower } from "../../borrowers/shared/borrower";
import { BorrowersService } from "../../borrowers/shared/borrowers.service";

@Component({
  selector: 'gsl-checked-out-page',
  templateUrl: './checked-out-page.component.html',
  styleUrls: ['./checked-out-page.component.css']
})
export class CheckedOutPageComponent implements OnInit {
  borrower: Borrower;


  constructor(
    private borrowersService: BorrowersService,
  ) { }

  ngOnInit() {
    this.borrowersService.getBorrower(747, {options: 'items,fees'})
      .subscribe(borrower => {this.borrower = borrower});
  }

}
