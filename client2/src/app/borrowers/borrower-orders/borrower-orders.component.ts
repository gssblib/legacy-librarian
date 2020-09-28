import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { BorrowerService } from "../shared/borrower.service";
import { Borrower } from "../shared/borrower";
import { OrdersService } from "../../orders/shared/orders.service";
import { Order } from "../../orders/shared/order";
import { RpcError } from "../../core/rpc-error";
import { BorrowersService } from "../shared/borrowers.service";
import { NotificationService } from "../../core/notification-service";

/**
 * Page showing the orders of a borrower.
 *
 * This page allows the librarian to view and manipulate the orders.
 */
@Component({
  selector: 'gsl-borrower-orders',
  templateUrl: './borrower-orders.component.html',
  styleUrls: ['./borrower-orders.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BorrowerOrdersComponent implements OnInit {
  readonly displayedColumns = ['id', 'start', 'end', 'item_count', 'actions'];
  readonly dataSource = new MatTableDataSource<Order>();

  private borrower?: Borrower;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly notificationService: NotificationService,
              private readonly ordersService: OrdersService,
              private readonly borrowerService: BorrowerService,
              private readonly borrowersService: BorrowersService) {
    this.borrowerService.subscribe(borrower => {
      this.setBorrower(borrower);
    });
  }

  private setBorrower(borrower?: Borrower): void {
    if (!borrower) {
      return;
    }
    this.borrower = borrower;
    this.dataSource.data = borrower.orders || [];
    this.changeDetectorRef.markForCheck();
  }

  ngOnInit() {
    this.setBorrower(this.borrowerService.get());
  }

  delete(order: Order): void {
    this.ordersService.remove(order).subscribe();
  }

  order(barcode: string): void {
    this.borrowersService.orderItem(barcode, this.borrower.borrowernumber)
      .subscribe(
        (barcode: string) => {
          this.notificationService.show('item ordered');
          this.borrowerService.reload();
        },
        (error: RpcError) => {
          this.notificationService.showError(this.errorMessage(error, barcode));
        });
  }

  private errorMessage(error: RpcError, barcode: string): string {
    switch (error.errorCode) {
      case 'ITEM_NOT_FOUND':
        return `item with barcode ${barcode} does not exist`;
      case 'BORROWER_NOT_FOUND':
        return `borrower ${this.borrower.borrowernumber} does not exist`;
      case 'CYCLE_NOT_FOUND':
        return `no open order cycle found`;
      default:
        return `error ordering item: ${error.errorCode}`;
    }
  }
}
