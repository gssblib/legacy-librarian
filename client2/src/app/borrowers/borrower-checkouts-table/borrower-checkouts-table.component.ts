import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ITdDataTableColumn,
  ITdDataTableSortChangeEvent,
  TdDataTableComponent,
  TdDataTableService,
  TdDataTableSortingOrder
} from '@covalent/core';
import { ItemsService } from '../../items/shared/items.service';
import { BorrowerService } from "../shared/borrower.service";
import { ErrorService } from "../../core/error-service";
import { RpcError } from "../../core/rpc-error";
import { Observable } from "rxjs/Observable";
import { Item } from "../../items/shared/item";

@Component({
  selector: 'gsl-borrower-checkouts-table',
  templateUrl: './borrower-checkouts-table.component.html',
  styleUrls: ['./borrower-checkouts-table.component.css']
})
export class BorrowerCheckoutsTableComponent implements OnInit {
  @Input()
  showActions: boolean = true;

  /** Checkout data set as input. */
  data: any[] = [];

  @Input()
  set checkouts(checkouts) {
    this.data = checkouts.map(this.prepareCheckout);
    this.updateRows();
  }

  /** Checkout data as shown in the (sorted) table. */
  rows: any[] = [];

  @ViewChild(TdDataTableComponent)
  table: TdDataTableComponent;

  columns: ITdDataTableColumn[] = [
    { name: 'barcode', label: 'Barcode', sortable: true, width: 100 },
    { name: 'title', label: 'Title', sortable: true, width: { min: 250 } },
    { name: 'description', label: 'Category', sortable: true, width: { min: 100, max: 200 } },
    { name: 'checkout_date', label: 'Checkout Date', sortable: true, width: 160 },
    { name: 'date_due', label: 'Due Date', sortable: true, width: 160 },
    { name: 'fine_due', label: 'Fine Due', sortable: true, width: 100 },
    { name: 'actions', label: 'Actions', width: 250 },
  ];

  sortBy = 'date_due';
  sortOrder = TdDataTableSortingOrder.Descending;

  constructor(private itemsService: ItemsService,
              private borrowerService: BorrowerService,
              private errorService: ErrorService,
              private dataTableService: TdDataTableService) {}

  onSort(event: ITdDataTableSortChangeEvent) {
    this.sortBy = event.name;
    this.sortOrder = event.order;
    this.updateRows();
  }

  ngOnInit() {
    if (!this.showActions) {
      this.columns.pop()
    }
  }

  private prepareCheckout(checkout: any): any {
    checkout.date_due = new Date(checkout.date_due);
    checkout.checkout_date = new Date(checkout.checkout_date);
    return checkout;
  }

  updateRows() {
    this.rows = this.dataTableService.sortData(this.data, this.sortBy, this.sortOrder);
    this.table.refresh();
  }

  onRenew(item) {
    this.itemsService.renewItem(item.barcode).subscribe(
      newItem => {
        item.date_due = newItem.checkout.date_due;
        this.table.refresh();
      },
      (error: RpcError) => this.onError(item, error)
    );
  }

  onReturn(item) {
    this.itemsService.returnItem(item.barcode).subscribe(
      item => this.borrowerService.reloadBorrower(),
      (error: RpcError) => this.onError(item, error)
    );
  }

  private onError(item: Item, error: RpcError) {
    this.errorService.showError(this.toErrorMessage(item, error));
    // Resolve the error.
    return Observable.create(() => {});
  }

  private toErrorMessage(item: Item, error: RpcError) {
    if (!error.errorCode) {
      return `Server error: ${error.httpResponseCode}`;
    }
    switch (error.errorCode) {
      case 'ENTITY_NOT_FOUND':
        return `Item with barcode ${item.barcode} does not exist.`;
      default:
        return `Server error: ${error.errorCode}`;
    }
  }
}
