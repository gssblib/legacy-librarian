import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { Item } from "../shared/item";
import {
  IPageChangeEvent, ITdDataTableColumn, ITdDataTableSortChangeEvent,
  TdDataTableSortingOrder
} from "@covalent/core";
import {TablePageFetcher, TablePageRequest, TableFetchResult} from "../../core/table-fetcher";

/**
 * Shows a table of Items with sorting and pagination.
 */
@Component({
  selector: 'gsl-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.css']
})
export class ItemsTableComponent implements OnInit, OnChanges {
  /** Fetches the range of items shown in the table. */
  @Input()
  fetcher: TablePageFetcher<Item>;

  /** Items currently shown in the table. */
  result: TableFetchResult<Item>;

  pageSize: number = 10;

  /** One-based number of the current page. */
  page: number = 1;

  sortOrder: string = 'title';

  order: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

  /** Meta-data for the table. */
  columns: ITdDataTableColumn[] = [
    { name: 'barcode', label: 'Barcode', sortable: true },
    { name: 'title', label: 'Title', sortable: true },
    { name: 'author', label: 'Author', sortable: true },
    { name: 'category', label: 'Category', sortable: true },
  ];

  constructor() { }

  ngOnInit() {
    this.fetch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fetch();
  }

  private toggleOrder(order: TdDataTableSortingOrder) {
    return TdDataTableSortingOrder.Ascending === order
      ? TdDataTableSortingOrder.Descending
      : TdDataTableSortingOrder.Ascending;
  }

  onSort(sortChange: ITdDataTableSortChangeEvent) {
    if (this.sortOrder === sortChange.name) {
      this.order = this.toggleOrder(this.order);
    } else {
      this.sortOrder = sortChange.name;
      this.order = TdDataTableSortingOrder.Ascending;
    }
    const sign = this.order == TdDataTableSortingOrder.Descending ? '-' : '';
    this.sortOrder = sign + sortChange.name;
    this.fetch();
  }

  onPage(pageChange: IPageChangeEvent) {
    this.page = pageChange.page;
    this.pageSize = pageChange.pageSize;
    this.fetch();
  }

  private getQuery(): TablePageRequest {
    const offset = (this.page - 1) * this.pageSize;
    return new TablePageRequest(offset, this.pageSize, this.sortOrder);
  }

  private fetch() {
    this.fetcher(this.getQuery()).subscribe(result => {
      this.result = result;
    });
  }
}
