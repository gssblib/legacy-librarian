import { AfterViewInit, Component, OnInit } from '@angular/core';
import { OrderCyclesService } from "../shared/order-cycles.service";
import { MatTableDataSource } from "@angular/material/table";
import { TableFetchResult } from "../../core/table-fetcher";
import { OrderCycle, OrderCycleState } from "../shared/order-cycle";
import { NotificationService } from "../../core/notification-service";
import { RpcError } from "../../core/rpc-error";
import { Router } from "@angular/router";
import { DateService } from "../../core/date-service";
import { OrderCycleService } from "../shared/order-cycle.service";

/**
 * Component showing the order cycles and allowing for opening and closing cycles.
 */
@Component({
  selector: 'gsl-order-cycles-page',
  templateUrl: './order-cycles-page.component.html',
  styleUrls: ['./order-cycles-page.component.css']
})
export class OrderCyclesPageComponent implements AfterViewInit, OnInit {
  readonly displayedColumns = ['start', 'end', 'state', 'actions'];
  readonly dataSource = new MatTableDataSource<OrderCycle>();

  get now(): Date {
    return this.dateService.now();
  }

  constructor(
    private readonly dateService: DateService,
    private readonly router: Router,
    private readonly orderCycleService: OrderCycleService,
    private readonly orderCyclesService: OrderCyclesService,
    private readonly notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.reload();
  }

  private reload(): void {
    this.orderCyclesService.getMany('', 0, 10, true)
      .subscribe((result: TableFetchResult<OrderCycle>) => {
        this.dataSource.data = result.rows;
      });
  }

  add(): void {
    this.orderCycleService.newOrderCycle = null;
    this.router.navigate(['ordercycles', 'add']).then();
  }

  edit(orderCycle: OrderCycle): void {
    this.orderCycleService.set(orderCycle);
    this.router.navigate(['ordercycles', 'edit']).then();
  }

  delete(orderCycle: OrderCycle): void {
    this.orderCyclesService.remove(orderCycle).toPromise()
      .then(
        () => {
          this.notificationService.show('order cycle removed');
          this.reload();
        },
        (err) => this.notificationService.showError(this.toErrorMessage(err)));
  }

  close(orderCycle: OrderCycle): void {
    console.log('close cycle', orderCycle);
  }

  private toErrorMessage(error: RpcError) {
    return `Server error: ${error.errorCode}`;
  }
}
