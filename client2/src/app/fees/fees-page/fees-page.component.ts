import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { SortKey } from "../../core/sort-key";
import {
  ITdDataTableColumn,
  TdDataTableService,
  TdDataTableSortingOrder,
  ITdDataTableSortChangeEvent
} from "@covalent/core";
import { FeesService } from "../fees.service";

@Component({
  selector: 'gsl-fees-page',
  templateUrl: './fees-page.component.html',
  styleUrls: ['./fees-page.component.css']
})
export class FeesPageComponent implements OnInit {
  date: Date;

  /** Current result being shown in the table. */
  data;

  /** Current sort key. Set from the URL and table sort event. */
  sortKey = new SortKey('surname', 'ASC');

  /** Meta-data for the fees table. */
  columns: ITdDataTableColumn[] = [
    {name: 'borrowernumber',
     label: 'Borrower #',
     width: 100},
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
    private snackbar: MatSnackBar,
    private feesService: FeesService) { }

  ngOnInit() {
    this.date = new Date();
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
    let data:any[] = Array.from(this.data);
    data = this.dataTableService.sortData(
      data, this.sortKey.name,
      this.sortKey.order == 'ASC' ? TdDataTableSortingOrder.Ascending : TdDataTableSortingOrder.Descending);
    this.data = data;
  }

  updateFees(date) {
    this.feesService.updateFees(date)
      .subscribe(
        data => {
          this.snackbar.open(
            'Fees updated!', 'Dismiss', {'extraClasses': ['success']});
        },
        error => {
          this.snackbar.open(
            error.data.status, 'Dismiss', {'extraClasses': ['error']});
        }
      );
  }
}
