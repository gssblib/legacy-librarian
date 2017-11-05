import { Component, OnInit } from '@angular/core';
import {
  IPageChangeEvent, ITdDataTableColumn, ITdDataTableSortChangeEvent,
  TdDataTableSortingOrder
} from "@covalent/core";
import { ItemsService } from "../shared/items.service";
import { Item } from "../shared/item";

@Component({
  selector: 'gsl-item-history',
  templateUrl: './item-history.component.html',
  styleUrls: ['./item-history.component.css'],
  inputs: ['item'],
})
export class ItemHistoryComponent implements OnInit {
  item: Item;
  sortOrder: string = 'checkout_date';
  order: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

  /** Meta-data for the table. */
  columns: ITdDataTableColumn[] = [
    { name: 'checkout_date', label: 'Checkout Date', sortable: true },
    { name: 'returndate', label: 'Return Date', sortable: true },
    { name: 'surname', label: 'Borrower', sortable: true },
  ];

  constructor(private itemsService: ItemsService) { }

  private toggleOrder(order: TdDataTableSortingOrder) {
    return TdDataTableSortingOrder.Ascending === order
      ? TdDataTableSortingOrder.Descending
      : TdDataTableSortingOrder.Ascending;
  }

  onSort(sortChange: ITdDataTableSortChangeEvent) {
    console.log(sortChange.name);
    if (this.sortOrder === sortChange.name) {
      this.order = this.toggleOrder(this.order);
    } else {
      this.sortOrder = sortChange.name;
      this.order = TdDataTableSortingOrder.Ascending;
    }
    const sign = this.order == TdDataTableSortingOrder.Descending ? '-' : '';
    this.sortOrder = sign + sortChange.name;
    console.log(this.sortOrder)
  }

  ngOnInit() {
    this.itemsService.getItem(this.item.barcode, {options: 'history'})
      .subscribe(item => {
        var history = item.history;
        this.item.history = history;
      }
    );
  }

}
