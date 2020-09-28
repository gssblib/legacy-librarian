import { Injectable } from '@angular/core';
import { ModelService } from "../../core/model.service";
import { OrdersService } from "./orders.service";
import { Order } from "./order";

@Injectable({providedIn: 'root'})
export class OrderService extends ModelService<Order>{

  constructor(private readonly ordersService: OrdersService) {
    super(ordersService);
  }
}
