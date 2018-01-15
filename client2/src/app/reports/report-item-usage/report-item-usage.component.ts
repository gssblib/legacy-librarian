import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import {
  IPageChangeEvent,
  ITdDataTableColumn,
  TdDataTableService,
  ITdDataTableSortChangeEvent,
  TdDataTableSortingOrder,
  TdPagingBarComponent,
} from "@covalent/core";
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { SortKey } from "../../core/sort-key";
import { RpcService } from "../../core/rpc.service";
import { ItemState } from "../../items/shared/item-state";
import { ItemsService } from "../../items/shared/items.service";

@Component({
  selector: 'gsl-report-item-usage',
  templateUrl: './report-item-usage.component.html',
  styleUrls: ['./report-item-usage.component.css']
})
export class ReportItemUsageComponent implements OnInit {
  ItemState = ItemState;

  form = new FormGroup({});

  criteriaFields: any;

  criteria: Object = {};

  start: number = 1;
  total: number;
  page: number = 1;
  pageSize: number = 50;

  /** Current sort key. Set from the URL and table sort event. */
  sortKey = new SortKey('title', 'ASC');

  @ViewChild('pagingBar')
  pagingBar: TdPagingBarComponent;

  /** Meta-data for the items table. */
  columns: ITdDataTableColumn[] = [
    {name: 'barcode', label: 'Barcode', sortable: true},
    {name: 'title', label: 'Title', sortable: true},
    {name: 'author', label: 'Author', sortable: true},
  ];

  result: any;
  data: any;

  constructor(
    private rpc: RpcService,
    private dataTableService: TdDataTableService,
    private itemsService: ItemsService,
  ) { }

  ngOnInit() {
    var fields = this.itemsService.getItemFields().subscribe(
      fields => {
        this.criteriaFields = fields.filter(
          field => field['key'] == 'subject' || field['key'] == 'classification');
        this.criteriaFields.push({
          key: 'lastCheckoutDate',
          type: 'input',
          templateOptions: {
            placeholder: "Last Checkout Date",
            required: true,
            type: "date"
          },
        });
      }
    );
  }

  onSort(event: ITdDataTableSortChangeEvent) {
    this.sortKey = SortKey.fromChange(event);
    this.filter();
  }

  onPage(event: IPageChangeEvent) {
    this.start = event.fromRow
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.filter();
  }

  private filter() {
    let result:any[] = Array.from(this.data);
    result = this.dataTableService.sortData(
      result, this.sortKey.name,
      this.sortKey.order == 'ASC' ? TdDataTableSortingOrder.Ascending : TdDataTableSortingOrder.Descending);
    result = this.dataTableService.pageData(
      result, this.start, this.page * this.pageSize);
    this.result = result;
  }

  updateReport(criteria) {
    if (criteria['classification'] === '') {
      delete this.criteria['classification'];
    }
    this.rpc.httpGet('reports/itemUsage', criteria).subscribe(
      data => {
        this.data = data['rows'];
        this.total = data['rows'].length;
        this.filter();
      }
    );
  }

  downloadCsv() {
    new Angular2Csv(
      this.data, 'item_usage_report.csv',
      {
        showTitle: true,
        showLabels: true,
        title: 'Item Usage Report',
      }
    );
  }
}
