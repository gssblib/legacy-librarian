import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from './order';
import { Injectable } from '@angular/core';
import { OrdersService } from './orders.service';
import { OrderService } from "./order.service";

@Injectable({providedIn: 'root'})
export class OrderResolverService implements Resolve<Order> {
  constructor(private ordersService: OrdersService, private orderService: OrderService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Order>|Order {
    const id = route.params['id'];
    const order = this.orderService.get();
    return order && order.id === id ? order : this.ordersService.get(id);
  }
}
