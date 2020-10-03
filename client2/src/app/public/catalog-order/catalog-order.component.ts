import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Order } from "../../orders/shared/order";
import { MatTableDataSource } from "@angular/material/table";
import { OrderItem } from "../../orders/shared/order-item";
import { Item } from "../../items/shared/item";

/**
 * Shows a single order of a borrower in the line catalog.
 */
@Component({
  selector: 'gsl-catalog-order',
  templateUrl: './catalog-order.component.html',
  styleUrls: ['./catalog-order.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogOrderComponent implements OnInit {
  readonly dataSource = new MatTableDataSource<OrderItem>();
  readonly displayedColumns = ['barcode', 'title', 'subject', 'author', 'classification', 'actions'];

  private _order?: Order;

  @Input() set order(order: Order) {
    this.dataSource.data = order.items;
    this._order = order;
  }

  get order(): Order|undefined {
    return this._order;
  }

  @Output() removeItem = new EventEmitter<Item>();

  ngOnInit(): void {
  }

  remove(item: Item) {
    this.removeItem.emit(item);
  }
}
