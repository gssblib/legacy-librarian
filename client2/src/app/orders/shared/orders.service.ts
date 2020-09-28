import { Injectable } from '@angular/core';
import { ModelsService } from "../../core/models.service";
import { Order } from "./order";
import { RpcService } from "../../core/rpc.service";
import { FormService } from "../../core/form.service";

/**
 * Service for accessing the orders in the backend.
 */
@Injectable({providedIn: 'root'})
export class OrdersService extends ModelsService<Order>{
  constructor(rpc: RpcService, formService: FormService) {
    super('orders', order => order.id, rpc, formService);
  }

  toModel(row: any): Order {
    return Object.assign(new Order(), row);
  }
}
