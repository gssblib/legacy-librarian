import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../../core/notification-service';
import { Borrower } from '../shared/borrower';
import { BorrowersService } from '../shared/borrowers.service';
import { BorrowerService } from '../shared/borrower.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';

/**
 * Presents the fees owed by a borrower.
 */
@Component({
  selector: 'gsl-borrower-fees',
  templateUrl: './borrower-fees.component.html',
  styleUrls: ['./borrower-fees.component.css']
})
export class BorrowerFeesComponent implements OnInit, AfterViewInit {
  displayedColumns = ['title', 'fee', 'checkout_date', 'date_due', 'returndate', 'actions'];

  borrower: Borrower;
  items: Object[] = [];
  dataSource = new MatTableDataSource<Object>([]);

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private notificationService: NotificationService,
              private borrowersService: BorrowersService,
              private borrowerService: BorrowerService) {
    borrowerService.subscribe(borrower => this.updateBorrower(borrower));
  }

  ngOnInit() {
    this.updateBorrower(this.borrowerService.get());
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  updateBorrower(borrower: Borrower) {
    this.borrower = borrower;
    this.items = this.allItems();
    this.dataSource.data = this.items;
  }

  allItems() {
    var items = [];
    for (let item of this.borrower.fees.items) {
      item.type = 'checkouts';
      items.push(item);
    }
    for (let item of this.borrower.fees.history) {
      item.type = 'history';
      items.push(item);
    }
    return items;
  }

  updateFees(action: Observable<any>, message: string) {
    action
      .subscribe(
        data => {
          this.borrowerService.reload();
          this.notificationService.show(message);
        },
        error => {
          this.notificationService.showError(error.data.status);
        }
      );
  }

  payAllFees() {
    this.updateFees(this.borrowerService.payFees(), 'All fees paid.');
  }

  payFee(item) {
    this.updateFees(this.borrowerService.payFee(item), 'Fee paid.');
  }

  waiveFee(item) {
    this.updateFees(this.borrowerService.waiveFee(item), 'Fee waived.');
  }
}
