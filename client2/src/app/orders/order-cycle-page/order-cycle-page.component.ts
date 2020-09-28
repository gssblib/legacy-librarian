import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { OrderCycle, OrderCycleState } from "../shared/order-cycle";
import { OrderCycleService } from "../shared/order-cycle.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { Order } from "../shared/order";
import { DateService } from "../../core/date-service";

@Component({
  selector: 'gsl-order-cycle-page',
  templateUrl: './order-cycle-page.component.html',
  styleUrls: ['./order-cycle-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCyclePageComponent implements OnInit, OnDestroy {
  private readonly destroyed = new Subject<void>();

  readonly displayedColumns = ['id', 'borrower'];
  readonly dateSource = new MatTableDataSource<Order>();

  cycle?: OrderCycle;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly orderCycleService: OrderCycleService,
              private readonly dateService: DateService,
              private readonly route: ActivatedRoute) {
    this.setCycle(orderCycleService.get());
    this.orderCycleService.modelObservable
      .pipe(takeUntil(this.destroyed)).subscribe(cycle => this.setCycle(cycle));
  }

  get state(): OrderCycleState {
    return this.cycle?.getState(this.dateService.now()) ?? OrderCycleState.UNKNOWN;
  }

  private setCycle(cycle?: OrderCycle): void {
    if (!cycle) {
      return;
    }
    this.cycle = cycle;
    this.dateSource.data = cycle.orders || [];
    this.changeDetectorRef.markForCheck();
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.orderCycleService.set(data['orderCycle']);
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
  }
}
