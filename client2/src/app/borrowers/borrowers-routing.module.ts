import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BorrowerPageComponent } from './borrower-page/borrower-page.component';
import { BorrowerAddPageComponent } from "./borrower-add-page/borrower-add-page.component";
import { BorrowerSearchPageComponent } from './borrower-search-page/borrower-search-page.component';
import { BorrowerCheckoutsComponent } from './borrower-checkouts/borrower-checkouts.component';
import { BorrowerFeesComponent } from './borrower-fees/borrower-fees.component';
import { BorrowerResolverService } from 'app/borrowers/shared/borrower.resolver.service';
import { BorrowerProfileComponent } from "./borrower-profile/borrower-profile.component";
import { BorrowerHistoryComponent } from './borrower-history/borrower-history.component';
import { BorrowerOrdersComponent } from "./borrower-orders/borrower-orders.component";
import { BorrowerOrderComponent } from "./borrower-order/borrower-order.component";
import { BorrowerRemindersComponent } from "./borrower-reminders/borrower-reminders.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'borrowers/add',
        component: BorrowerAddPageComponent,
      },
      {
        path: 'borrowers/:id',
        component: BorrowerPageComponent,
        resolve: {
          borrower: BorrowerResolverService,
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'checkouts',
          },
          {
            path: 'checkouts',
            component: BorrowerCheckoutsComponent,
          },
          {
            path: 'fees',
            component: BorrowerFeesComponent,
          },
          {
            path: 'orders',
            pathMatch: 'full',
            component: BorrowerOrdersComponent,
          },
          {
            path: 'orders/:order_id',
            component: BorrowerOrderComponent,
          },
          {
            path: 'profile',
            component: BorrowerProfileComponent,
          },
          {
            path: 'history',
            component: BorrowerHistoryComponent,
          },
          {
            path: 'reminders',
            component: BorrowerRemindersComponent,
          },
        ]
      },
      {
        path: 'borrowers',
        pathMatch: 'full',
        component: BorrowerSearchPageComponent,
      },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class BorrowersRoutingModule {
}
