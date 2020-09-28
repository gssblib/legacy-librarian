import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderCyclesPageComponent } from "./order-cycles-page/order-cycles-page.component";
import { OrderCycleAddPageComponent } from "./order-cycle-add-page/order-cycle-add-page.component";
import { OrderCycleEditPageComponent } from "./order-cycle-edit-page/order-cycle-edit-page.component";
import { OrderResolverService } from "./shared/order-resolver.service";
import { OrderPageComponent } from "./order-page/order-page.component";
import { OrdersPageComponent } from "./orders-page/orders-page.component";
import { OrderCyclePageComponent } from "./order-cycle-page/order-cycle-page.component";
import { OrderCycleResolverService } from "./shared/order-cycle-resolver.service";

/**
 * Module defining the sub-routes for the order management.
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'ordercycles',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: OrderCyclesPageComponent,
          },
          {
            path: 'add',
            component: OrderCycleAddPageComponent,
          },
          {
            path: 'edit',
            component: OrderCycleEditPageComponent,
          },
          {
            path: ':id',
            component: OrderCyclePageComponent,
            resolve: {
              'orderCycle': OrderCycleResolverService,
            },
          },
        ],
      },
      {
        path: 'orders',
        pathMatch: 'full',
        component: OrdersPageComponent,
      },
      {
        path: 'orders/:id',
        component: OrderPageComponent,
        resolve: {
          'order': OrderResolverService,
        },
      },
    ])
  ],
  exports: [
    RouterModule,
  ],
})
export class OrdersRoutingModule {
}
