import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { OrderCyclesService } from "../shared/order-cycles.service";
import { OrderCycle } from "../shared/order-cycle";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { NotificationService } from "../../core/notification-service";
import { Router } from "@angular/router";
import { RpcError } from "../../core/rpc-error";
import { OrderCycleService } from "../shared/order-cycle.service";

@Component({
  selector: 'gsl-order-cycle-add-page',
  templateUrl: './order-cycle-add-page.component.html',
  styleUrls: ['./order-cycle-add-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCycleAddPageComponent implements OnInit {

  orderWindowStart = new FormControl(new Date());
  orderWindowEnd = new FormControl(new Date());

  form = new FormGroup({
    order_window_start: this.orderWindowStart,
    order_window_end: this.orderWindowEnd,
    orderWindowStart: this.orderWindowStart,
  });
  orderCycle: OrderCycle;
  fields: Array<FormlyFieldConfig> = [];

  constructor(private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly orderCyclesService: OrderCyclesService,
              private readonly orderCycleService: OrderCycleService,
              private readonly router: Router,
              private readonly notificationService: NotificationService) {
    this.orderCycle = orderCycleService.newOrderCycle;
    this.orderCyclesService.getFormlyFields().subscribe(fields => {
      this.fields = fields
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnInit(): void {
  }

  submitForm(orderCycle: OrderCycle) {
    this.orderCyclesService.add(orderCycle).subscribe(
      cycle => this.router.navigate(['ordercycles']),
      (error: RpcError) => this.notificationService.showError(this.toErrorMessage(error)));
  }

  private toErrorMessage(error: RpcError): string {
    switch (error.errorCode) {
      case 'ORDER_CYCLE_OVERLAP':
        return 'New order cycle overlaps with existing one';
      default:
        return `Server error: ${error.errorCode}`;
    }
  }
}
