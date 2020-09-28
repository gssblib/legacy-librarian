import { Component, OnInit } from '@angular/core';
import { OrderCycle } from "../../orders/shared/order-cycle";

/**
 * Page showing a single order of a borrower with the list of ordered items.
 *
 * This page allows the librarian to change the order by adding new items or
 * removing items from the order. This is similar to the physical checkouts
 * and returns but only affects the selected order.
 */
@Component({
  selector: 'gsl-borrower-order',
  templateUrl: './borrower-order.component.html',
  styleUrls: ['./borrower-order.component.css']
})
export class BorrowerOrderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
