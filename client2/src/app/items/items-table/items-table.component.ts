import { Component, Input, OnInit } from '@angular/core';
import { Item } from "../shared/item";

@Component({
  selector: 'gsl-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.css']
})
export class ItemsTableComponent implements OnInit {
  @Input()
  items: Item[] = [];

  constructor() { }

  ngOnInit() {
  }
}
