import { Component, Input, OnInit } from '@angular/core';
import { SortKey } from '../../core/sort-key';
import {
  ITdDataTableColumn, ITdDataTableSortChangeEvent, TdDataTableService,
  TdDataTableSortingOrder
} from '@covalent/core';
import { FeesService } from '../fees.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'gsl-fees-table',
  templateUrl: './fees-table.component.html',
  styleUrls: ['./fees-table.component.css']
})
export class FeesTableComponent implements OnInit {
  /** Current result being shown in the table. */
  data;

  /** Current sort key. Set from the URL and table sort event. */
  sortKey = new SortKey('surname', 'ASC');

  /** Meta-data for the fees table. */
  columns: ITdDataTableColumn[] = [
    {name: 'surname',
      label: 'Borrower Name',
      sortable: true},
    {name: 'fee',
      label: 'Fee',
      sortable: true,
      width: 100,
      format: value => {return this.currencyPipe.transform(value)}},
    {name: 'newFee',
      label: 'Checked Out Items',
      sortable: true,
      width: 150,
      format: value => {return this.currencyPipe.transform(value)}},
    {name: 'oldFee',
      label: 'Returned Items',
      sortable: true,
      width: 150,
      format: value => {return this.currencyPipe.transform(value)}},
  ];

  constructor(
    private currencyPipe: CurrencyPipe,
    private dataTableService: TdDataTableService,
    private feesService: FeesService) { }

  ngOnInit() {
    this.feesService.getFees().subscribe(
      data => {
        this.data = data;
        this.prepareData();
      }
    );
  }

  onSort(event: ITdDataTableSortChangeEvent) {
    this.sortKey = SortKey.fromChange(event);
    this.prepareData();
  }

  prepareData() {
    let data: any[] = Array.from(this.data);
    data = this.dataTableService.sortData(
      data, this.sortKey.name,
      this.sortKey.order == 'ASC' ? TdDataTableSortingOrder.Ascending : TdDataTableSortingOrder.Descending);
    this.data = data;
  }
}
