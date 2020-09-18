import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { RpcError } from "../../core/rpc-error";
import { BarcodeFieldComponent } from "../../shared/barcode-field/barcode-field.component";
import { Borrower } from '../shared/borrower';
import { BorrowersService, ItemCheckout } from '../shared/borrowers.service';
import { BorrowerService } from '../shared/borrower.service';
import { ItemsService } from "../../items/shared/items.service";
import { DateService } from "../../core/date-service";
import { FocusService } from "../../core/focus.service";
import { RenewReturnDialogComponent } from "./renew-return-dialog.component";
import { NotificationService } from "../../core/notification-service";
import {MatDialog} from "@angular/material/dialog";

/**
 * Presents the items that a borrower has currently checked out.
 */
@Component({
  selector: 'gsl-borrower-checkouts',
  templateUrl: './borrower-checkouts.component.html',
  styleUrls: ['./borrower-checkouts.component.css']
})
export class BorrowerCheckoutsComponent implements OnInit, AfterViewInit {
  borrower: Borrower;
  itemCountClass: string = '';

  readonly checkoutLimit = 65;

  get checkoutLimitReached(): boolean {
    return this.borrower && this.borrower.items.length >= this.checkoutLimit;
  }

  @Output()
  borrowerChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('barcode')
  barcode: BarcodeFieldComponent;

  constructor(private notificationService: NotificationService,
              private borrowerService: BorrowerService,
              private borrowersService: BorrowersService,
              private itemsService: ItemsService,
              private dateService: DateService,
              private focusService: FocusService,
              private matDialog: MatDialog) {
    this.borrowerService.subscribe(borrower => {
      this.borrower = borrower;
    });
  }

  ngOnInit() {
    this.borrower = this.borrowerService.get();
  }

  ngAfterViewInit(): void {
    this.focusService.add('checkoutBarcode', () => this.reset());
  }

  pulseCount() {
    this.itemCountClass = 'pulse';
    setTimeout(() => { this.itemCountClass = ''; }, 1000);
  }

  checkout(barcode) {
    const item = this.borrower.items.find(item => item.barcode === barcode);
    if (item) {
      const dialog = this.matDialog.open(RenewReturnDialogComponent, {});
      dialog.afterClosed().subscribe(result => {
        if (result === 'renew') {
          this.renewItem(item);
        } else if (result === 'return') {
          this.returnItem(item);
        }
        this.barcode.barcode = '';
        focus();
      })
    } else if (this.checkoutLimitReached) {
      this.notificationService.show("Checkout limit reached. Please return an item before checking out a new one.");
      this.barcode.barcode = '';
      focus();
    } else {
      this.borrowersService.checkOutItem(barcode, this.borrower.borrowernumber)
        .subscribe(
          (barcode: string) => this.onSuccess(barcode),
          (error: RpcError) => this.onError(barcode, error));
    }
  }

  renewItem(item) {
    this.itemsService.renewItem(item.barcode).subscribe(
      newItem => {
        item.date_due = newItem.checkout.date_due;
      },
      (error: RpcError) => this.onError(item, error)
    );
  }

  returnItem(item) {
    this.itemsService.returnItem(item.barcode).subscribe(
      item => this.borrowerService.reload(),
      (error: RpcError) => this.onError(item, error)
    );
  }

  get checkedOutToday(): ItemCheckout[] {
    return this.borrower.items.filter(checkout => checkout.checkoutDate > this.dateService.yesterday());
  }

  get lateItems(): ItemCheckout[] {
    return this.borrower.items.filter(checkout => checkout.dueDate < this.dateService.yesterday());
  }

  reset() {
    this.barcode.reset();
    this.barcode.setFocus();
  }

  renewAll() {
    this.borrowerService.renewAll().subscribe(
      result => {
        this.borrowerService.reload();
      },
      (error: RpcError) => this.notificationService.showError('error renewing items')
    );
    this.reset();
  }

  private onSuccess(result) {
    this.borrowerChange.emit(null);
    this.borrowerService.reload();
    this.barcode.barcode = '';
    this.pulseCount();
  }

  private onError(barcode: string, error: RpcError) {
    this.notificationService.showError(this.toErrorMessage(barcode, error));
    this.barcode.barcode = '';
    // Resolve the error.
    return Observable.create(() => {});
  }

  private toErrorMessage(barcode: string, error: RpcError) {
    switch (error.errorCode) {
      case 'ENTITY_NOT_FOUND':
        return `Item with barcode ${barcode} does not exist.`;
      case 'ITEM_ALREADY_CHECKED_OUT':
        return `Item with barcode ${barcode} is already checked out.`;
      default:
        return `Server error: ${error.errorCode}`;
    }
  }
}
