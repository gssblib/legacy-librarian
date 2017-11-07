import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import {
  ITdDataTableColumn,
  TdDataTableService,
  TdDataTableSortingOrder,
  ITdDataTableSortChangeEvent
} from "@covalent/core";
import { SortKey } from "../../core/sort-key";
import { Borrower } from '../shared/borrower';
import { BorrowersService } from '../shared/borrowers.service';
import { BorrowerService } from '../shared/borrower.service';

/**
 * Presents the fees owed by a borrower.
 */
@Component({
  selector: 'gsl-borrower-fees',
  templateUrl: './borrower-fees.component.html',
  styleUrls: ['./borrower-fees.component.css']
})
export class BorrowerFeesComponent implements OnInit {
  borrower: Borrower;
  items: any[] = [];

  /** Current sort key. Set from the URL and table sort event. */
  sortKey = new SortKey('title', 'ASC');

  /** Meta-data for the fees table. */
  columns: ITdDataTableColumn[] = [
    {name: 'barcode', label: 'Barcode', sortable: true,
     width: 100},
    {name: 'title', label: 'Ttile', sortable: true},
    {name: 'fine', label: 'Fine Due', sortable: true,
     width: 75},
    {name: 'checkout_date', label: 'Checked Out', sortable: true,
     width: 130,
     format: value => {
       return this.datePipe.transform(value, 'dd MMM yyyy')
     }
    },
    {name: 'date_due', label: 'Date Due', sortable: true,
     width: 130,
     format: value => {
       return this.datePipe.transform(value, 'dd MMM yyyy')
     }
    },
    {name: 'returndate', label: 'Returned', sortable: true,
     width: 130,
     format: value => {
       return this.datePipe.transform(value, 'dd MMM yyyy')
     }
    },
    {name: 'actions', label: 'Actions'},
  ];

  constructor(
    private datePipe: DatePipe,
    private dataTableService: TdDataTableService,
    private snackbar: MatSnackBar,
    private borrowersService: BorrowersService,
    private borrowerService: BorrowerService) { }

  ngOnInit() {
    this.borrower = this.borrowerService.borrower;
    this.items = this.allItems();
    this.sortItems()
  }

  allItems() {
    var items = [];
    for (let item of this.borrower.fees.items) {
      item.type = 'checkouts';
      items.push(item);
    };
    for (let item of this.borrower.fees.history) {
      item.type = 'history';
      items.push(item);
    };
    return items;
  }

  onSort(event: ITdDataTableSortChangeEvent) {
    this.sortKey = SortKey.fromChange(event);
    this.sortItems();
  }

  sortItems() {
    let items:any[] = Array.from(this.items);
    items = this.dataTableService.sortData(
      items, this.sortKey.name,
      this.sortKey.order == 'ASC' ? TdDataTableSortingOrder.Ascending : TdDataTableSortingOrder.Descending);
    this.items = items;
  }

  payAllFees() {
    this.borrowerService.payFees()
      .subscribe(
        data => {
          console.log(data)
          this.updateBorrowerFees();
          this.snackbar.open(
            'Feea paid!', 'Dismiss', {'extraClasses': ['success']});
        },
        error => {
          this.snackbar.open(
            error.data.status, 'Dismiss', {'extraClasses': ['error']});
        }
      );
  }

  payFee(item) {
    this.borrowerService.payFee(item)
      .subscribe(
        data => {
          console.log(data)
          this.updateBorrowerFees();
          this.snackbar.open(
            'Fee paid!', 'Dismiss', {'extraClasses': ['success']});
        },
        error => {
          this.snackbar.open(
            error.data.status, 'Dismiss', {'extraClasses': ['error']});
        }
      );
  }

  waiveFee(item) {
    this.borrowerService.waiveFee(item)
      .subscribe(
        data => {
          this.updateBorrowerFees();
          this.snackbar.open(
            'Fee waived!', 'Dismiss', {'extraClasses': ['success']});
        },
        error => {
          this.snackbar.open(
            error.data.status, 'Dismiss', {'extraClasses': ['error']});
        }
      );
  }

  private updateBorrowerFees() {
    this.borrowersService.getBorrower( this.borrower.borrowernumber, {options: 'items,fees'})
      .subscribe(
        borrower => {
          this.borrower.fees = borrower.fees;
          this.items = this.allItems();
          this.sortItems()
        }
      );
  }

}
