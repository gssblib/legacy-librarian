import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { OrdersService } from "../shared/orders.service";
import { OrderService } from "../shared/order.service";
import { ActivatedRoute } from "@angular/router";
import { Order } from "../shared/order";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { OrderItem } from "../shared/order-item";
import { Item } from "../../items/shared/item";
import { NotificationService } from "../../core/notification-service";

/**
 * Component for viewing and managing a single order and its items.
 *
 * This page allows to add new items to the order, remove items, and print the list of items.
 */
@Component({
  selector: 'gsl-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPageComponent implements OnInit, OnDestroy {
  private readonly destroyed = new Subject<void>();

  readonly dataSource = new MatTableDataSource<OrderItem>();
  readonly displayedColumns = ['barcode', 'title', 'subject', 'author', 'classification', 'actions'];

  order?: Order;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly notiificationService: NotificationService,
              private readonly ordersService: OrdersService,
              private readonly orderService: OrderService,
              private readonly route: ActivatedRoute) {
    this.setOrder(this.orderService.get());
    this.orderService.modelObservable
      .pipe(takeUntil(this.destroyed)).subscribe(order => this.setOrder(order));
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.orderService.set(data['order']);
    });
  }

  private setOrder(order?: Order): void {
    if (!order) {
      return;
    }
    this.order = order;
    this.dataSource.data = order.items || [];
    this.changeDetectorRef.markForCheck();
  }

  remove(item: Item) {
    if (!this.order) {
      return;
    }
    this.ordersService.removeItemFromOrder(this.order, item).subscribe(
      order => {
        this.notiificationService.show('Item removed from order');
        this.setOrder(order);
      },
      error => {
        this.notiificationService.show('Couldn\'t removed item from order');
      }
    );
  }

  ngOnDestroy(): void {
    this.destroyed.next();
  }

  print() {
    window.print();
  }
}
