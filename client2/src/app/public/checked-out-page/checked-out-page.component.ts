import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Borrower } from "../../borrowers/shared/borrower";
import { BorrowersService } from "../../borrowers/shared/borrowers.service";

@Component({
  selector: 'gsl-checked-out-page',
  templateUrl: './checked-out-page.component.html',
  styleUrls: ['./checked-out-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckedOutPageComponent implements OnInit {
  borrower?: Borrower;

  get hasItems(): boolean {
    return this.borrower && this.borrower.items.length > 0;
  }

  constructor(private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly borrowersService: BorrowersService) {
  }

  ngOnInit() {
    this.borrowersService.getMyBorrower().subscribe(
      borrower => {
        this.borrower = borrower;
        this.changeDetectorRef.markForCheck();
      });
  }
}
