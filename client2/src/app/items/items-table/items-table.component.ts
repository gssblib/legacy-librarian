import { Component, Input, OnInit } from '@angular/core';
import { Item } from "../shared/item";
import { ITdDataTableColumn } from "@covalent/core";

@Component({
  selector: 'gsl-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.css']
})
export class ItemsTableComponent implements OnInit {
  @Input()
  items: Item[] = [];

  columns: ITdDataTableColumn[] = [
    { name: 'barcode', label: 'Barcode', sortable: true },
    { name: 'title', label: 'Title', sortable: true },
  ];

  constructor() { }

  ngOnInit() {
  }
}
