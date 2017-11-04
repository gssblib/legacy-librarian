import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ITdDataTableColumn, TdDataTableComponent } from '@covalent/core';
import { ItemsService } from '../../items/shared/items.service';

@Component({
  selector: 'gsl-borrower-checkouts-table',
  templateUrl: './borrower-checkouts-table.component.html',
  styleUrls: ['./borrower-checkouts-table.component.css']
})
export class BorrowerCheckoutsTableComponent implements OnInit {
  @Input()
  checkouts;

  @ViewChild(TdDataTableComponent)
  table: TdDataTableComponent;

  columns: ITdDataTableColumn[] = [
    { name: 'barcode', label: 'Barcode', sortable: true, width: 100 },
    { name: 'title', label: 'Title', sortable: true, width: { min: 250 } },
    { name: 'description', label: 'Description', sortable: true, width: { min: 100, max: 200 } },
    { name: 'checkout_date', label: 'Checkout Date', sortable: true, width: 140 },
    { name: 'date_due', label: 'Due Date', sortable: true, width: 140 },
    { name: 'fine_due', label: 'Fine Due', sortable: true, width: 80 },
    { name: 'renew', label: 'Renewal', width: 120 },
  ];

  constructor(private itemsService: ItemsService) {}

  ngOnInit() {
  }

  onRenew(item) {
    this.itemsService.renewItem(item.barcode).subscribe(
      newItem => {
        item.date_due = newItem.checkout.date_due;
        this.table.refresh();
      }
    );
  }
}
