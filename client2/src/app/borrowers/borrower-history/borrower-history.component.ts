import { Component, OnInit, ViewChild } from '@angular/core';
import { Borrower } from '../shared/borrower';
import { BorrowersService, ItemCheckout } from '../shared/borrowers.service';
import { BorrowerService } from '../shared/borrower.service';
import { TableFetchResult } from '../../core/table-fetcher';
import { SortKey } from '../../core/sort-key';
import {
  IPageChangeEvent, ITdDataTableColumn, ITdDataTableSortChangeEvent,
  TdPagingBarComponent
} from '@covalent/core';

/**
 * Presents the items that a borrower has checked out in the past.
 */
@Component({
  selector: 'gsl-borrower-history',
  templateUrl: './borrower-history.component.html',
  styleUrls: ['./borrower-history.component.css']
})
export class BorrowerHistoryComponent implements OnInit {
  borrower: Borrower;
  result: TableFetchResult<ItemCheckout>;

  /** Current page number. Set from the URL and the pagination bar. */
  page: number = 1;

  /** Current page size. Set from the URL and the pagination bar. */
  pageSize: number = 10;

  /** Current sort key. Set from the URL and table sort event. */
  sortKey = new SortKey('checkout_date', 'DESC');

  @ViewChild('pagingBar')
  pagingBar: TdPagingBarComponent;

  /** Meta-data for the fees table. */
  columns: ITdDataTableColumn[] = [
    {name: 'barcode', label: 'Barcode', sortable: false, width: 100},
    {name: 'title', label: 'Title', sortable: true},
    {name: 'checkout_date', label: 'Checkout Date', sortable: true, width: 150},
    {name: 'returndate', label: 'Return Date', sortable: true, width: 150},
  ];

  constructor(private borrowersService: BorrowersService,
              private borrowerService: BorrowerService) {
    this.borrowerService.borrowerObservable.subscribe(borrower => {
      this.borrower = borrower;
      this.reload();
    });
  }

  ngOnInit() {
    this.borrower = this.borrowerService.getBorrower();
    this.reload();
  }

  onSort(event: ITdDataTableSortChangeEvent) {
    this.sortKey = SortKey.fromChange(event);
    this.reload();
  }

  onPage(event: IPageChangeEvent) {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.reload();
  }

  /**
   * Gets the items from the server.
   */
  private reload() {
    const params = {
      offset: (this.page - 1) * this.pageSize,
      limit: this.pageSize, returnCount: true,
      _order: this.sortKey.toString(),
    };

    this.borrowersService.getBorrowerHistory(this.borrower.borrowernumber, params).subscribe(
      result => this.result = result
    );
  }
}
