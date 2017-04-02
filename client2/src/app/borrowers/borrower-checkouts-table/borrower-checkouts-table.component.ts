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
    { name: 'barcode', label: 'Barcode', sortable: true },
    { name: 'title', label: 'Title', sortable: true },
    { name: 'description', label: 'Description', sortable: true },
    { name: 'checkout_date', label: 'Checkout Date', sortable: true },
    { name: 'date_due', label: 'Due Date', sortable: true },
    { name: 'fine_due', label: 'Fine Due', sortable: true },
  ];

  constructor() { }

  ngOnInit() {
  }
}
