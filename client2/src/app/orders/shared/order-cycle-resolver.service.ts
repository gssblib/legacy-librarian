import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { OrderCyclesService } from "./order-cycles.service";
import { OrderCycleService } from "./order-cycle.service";
import { OrderCycle } from "./order-cycle";

@Injectable({providedIn: 'root'})
export class OrderCycleResolverService implements Resolve<OrderCycle> {
  constructor(private orderCyclesService: OrderCyclesService,
              private orderCycleService: OrderCycleService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<OrderCycle>|OrderCycle {
    const id = route.params['id'];
    const order = this.orderCycleService.get();
    return order && order.id === id ? order : this.orderCyclesService.get(id);
  }
}
