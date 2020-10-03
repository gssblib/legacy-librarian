import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BorrowersService } from "../../borrowers/shared/borrowers.service";
import { Borrower } from "../../borrowers/shared/borrower";
import { Item } from "../../items/shared/item";
import { Order } from "../../orders/shared/order";
import { NotificationService } from "../../core/notification-service";

@Component({
  selector: 'gsl-catalog-order-page',
  templateUrl: './catalog-order-page.component.html',
  styleUrls: ['./catalog-order-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogOrderPageComponent implements OnInit {
  borrower?: Borrower;

  get hasOrder(): boolean {
    return this.borrowersService && this.borrower.order !== undefined;
  }

  constructor(private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly borrowersService: BorrowersService,
              private readonly notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loadBorrower();
  }

  private loadBorrower() {
    this.borrowersService.getMyBorrower().subscribe(
      borrower => {
        this.borrower = borrower;
        this.changeDetectorRef.markForCheck();
      });
  }

  removeOrderItem(item: Item) {
    if (!this.borrower || !this.borrower.order) {
      return;
    }
    const order: Order = this.borrower.order;
    this.borrowersService.removeOrderedItem(this.borrower.borrowernumber, order.id, item.id)
      .subscribe(
        () => {
          this.notificationService.show('Item removed from order');
          this.loadBorrower();
        },
        error => {
          this.notificationService.show('Couldn\'t remove item from order');
        }
      );
  }
}
