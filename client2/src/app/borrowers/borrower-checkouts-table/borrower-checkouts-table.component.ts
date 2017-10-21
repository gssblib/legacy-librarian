import { Component, Input, OnInit } from '@angular/core';
import { ITdDataTableColumn } from "@covalent/core";

@Component({
  selector: 'gsl-borrower-checkouts-table',
  templateUrl: './borrower-checkouts-table.component.html',
  styleUrls: ['./borrower-checkouts-table.component.css']
})
export class BorrowerCheckoutsTableComponent implements OnInit {
  @Input()
  checkouts;

  columns: ITdDataTableColumn[] = [
    { name: 'barcode', label: 'Barcode', sortable: true, width: 100 },
    { name: 'title', label: 'Title', sortable: true, width: { min: 250 } },
    { name: 'description', label: 'Description', sortable: true, width: { min: 100, max: 200 } },
    { name: 'checkout_date', label: 'Checkout Date', sortable: true, width: 140 },
    { name: 'date_due', label: 'Due Date', sortable: true, width: 140 },
    { name: 'fine_due', label: 'Fine Due', sortable: true },
  ];

  constructor() { }

  ngOnInit() {
  }
}
