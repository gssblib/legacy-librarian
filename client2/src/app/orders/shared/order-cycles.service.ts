import { Injectable } from '@angular/core';
import { ModelsService } from "../../core/models.service";
import { OrderCycle } from "./order-cycle";
import { RpcService } from "../../core/rpc.service";
import { FormService } from "../../core/form.service";
import { DateService } from "../../core/date-service";

/**
 * Service for accessing the order cycles in the backend.
 */
@Injectable({providedIn: 'root'})
export class OrderCyclesService extends ModelsService<OrderCycle> {

  constructor(rpc: RpcService, formService: FormService) {
    super('ordercycles', orderCycle => orderCycle.id, rpc, formService);
  }

  toModel(row: any): OrderCycle {
    const orderCycle = Object.assign(new OrderCycle(), row);
    orderCycle.id = row.id;
    orderCycle.order_window_start = DateService.toDate(row.order_window_start);
    orderCycle.order_window_end = DateService.toDate(row.order_window_end);
    return orderCycle;
  }

  beforeSave(model: OrderCycle) {
    model.order_window_start = DateService.toString(model.order_window_start);
    model.order_window_end = DateService.toString(model.order_window_end);
  }
}
