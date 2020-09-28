import { Component, OnInit } from '@angular/core';
import { OrderCyclesService } from "../shared/order-cycles.service";
import { OrderCycleService } from "../shared/order-cycle.service";
import { Router } from "@angular/router";
import { NotificationService } from "../../core/notification-service";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { OrderCycle } from "../shared/order-cycle";

@Component({
  selector: 'gsl-order-cycle-edit-page',
  templateUrl: './order-cycle-edit-page.component.html',
  styleUrls: ['./order-cycle-edit-page.component.css']
})
export class OrderCycleEditPageComponent implements OnInit {
  form = new FormGroup({});
  fields: Array<FormlyFieldConfig> = [];
  orderCycle: OrderCycle;

  constructor(private readonly router: Router,
              private readonly notificationService: NotificationService,
              private readonly orderCyclesService: OrderCyclesService,
              private readonly orderCycleService: OrderCycleService) {
    this.orderCyclesService.getFormlyFields().subscribe(fields => this.fields = fields);
    this.orderCycleService.subscribe(orderCycle => this.orderCycle = orderCycle);
  }

  ngOnInit(): void {
    this.orderCycle = this.orderCycleService.get();
  }

  submit(): void {}

  cancel(): void {}
}
