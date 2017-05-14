import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Borrower } from '../shared/borrower';
import { BorrowersService } from '../shared/borrowers.service';
import { BorrowerService } from '../shared/borrower.service';

/**
 * Presents the items that a borrower has currently checked out.
 */
@Component({
  selector: 'gsl-borrower-checkouts',
  templateUrl: './borrower-checkouts.component.html',
  styleUrls: ['./borrower-checkouts.component.css']
})
export class BorrowerCheckoutsComponent implements OnInit {
  borrower: Borrower;

  @Output()
  borrowerChange: EventEmitter<any> = new EventEmitter();

  constructor(private borrowerService: BorrowerService,
              private borrowersService: BorrowersService) {
  }

  ngOnInit() {
    this.borrower = this.borrowerService.borrower;
  }

  checkout(barcode) {
    console.log('checkout ' + JSON.stringify(barcode));
    this.borrowersService.checkOutItem(barcode, this.borrower.borrowernumber).subscribe(
      result => {
        this.borrowerChange.emit(null);
      }
    );
  }
}
