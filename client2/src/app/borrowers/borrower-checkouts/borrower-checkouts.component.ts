import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Borrower } from "../shared/Borrower";
import { BorrowersService } from "../shared/borrowers.service";

/**
 * Presents the items that a borrower has currently checked out.
 */
@Component({
  selector: 'gsl-borrower-checkouts',
  templateUrl: './borrower-checkouts.component.html',
  styleUrls: ['./borrower-checkouts.component.css']
})
export class BorrowerCheckoutsComponent implements OnInit {
  @Input()
  borrower: Borrower;

  @Output()
  borrowerChange: EventEmitter<any> = new EventEmitter();

  constructor(private borrowersService: BorrowersService) {
  }

  ngOnInit() {
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
