import { Injectable } from '@angular/core';
import { ModelsService } from "../../core/models.service";
import { Order } from "./order";
import { RpcService } from "../../core/rpc.service";
import { FormService } from "../../core/form.service";
import { Observable } from "rxjs";
import { Item } from "../../items/shared/item";
import { map } from "rxjs/operators";

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

  removeItemFromOrder(order: Order, item: Item): Observable<Order> {
    return this.rpc.httpDelete(`orders/${order.id}/items/${item.id}`)
      .pipe(map(result => result as Order));
  }
}
