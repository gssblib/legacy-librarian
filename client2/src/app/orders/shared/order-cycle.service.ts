import { Injectable } from '@angular/core';
import { ModelService } from "../../core/model.service";
import { OrderCycle } from "./order-cycle";
import { OrderCyclesService } from "./order-cycles.service";
import { DateService } from "../../core/date-service";

@Injectable({providedIn: 'root'})
export class OrderCycleService extends ModelService<OrderCycle>{
  _newOrderCycle: OrderCycle;

  orderCycle: OrderCycle|null = null;

  set newOrderCycle(orderCycle: OrderCycle|null) {
    this._newOrderCycle = Object.assign(new OrderCycle(), orderCycle);
  }

  get newOrderCycle(): OrderCycle {
    return this._newOrderCycle || this.createNewOrderCycle();
  }

  constructor(private readonly orderCyclesService: OrderCyclesService,
              private readonly dateService: DateService) {
    super(orderCyclesService);
  }

  private createNewOrderCycle(): OrderCycle {
    const item = new OrderCycle();
    item.order_window_start = this.dateService.now();
    item.order_window_end = this.dateService.now();
    return item;
  }
}
