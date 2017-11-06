import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BorrowerPageComponent } from './borrower-page/borrower-page.component';
import { BorrowerAddPageComponent } from "./borrower-add-page/borrower-add-page.component";
import { BorrowerSearchPageComponent } from './borrower-search-page/borrower-search-page.component';
import { BorrowerCheckoutsComponent } from './borrower-checkouts/borrower-checkouts.component';
import { BorrowerFeesComponent } from './borrower-fees/borrower-fees.component';
import { BorrowerResolverService } from 'app/borrowers/shared/borrower.resolver.service';
import { BorrowerProfileComponent } from "./borrower-profile/borrower-profile.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'borrowers/add', component: BorrowerAddPageComponent},
      {
        path: 'borrowers/:id',
        component: BorrowerPageComponent,
        resolve: {
          borrower: BorrowerResolverService,
        },
        children: [
          {path: 'checkouts', component: BorrowerCheckoutsComponent},
          {path: 'fees', component: BorrowerFeesComponent},
          {path: 'profile', component: BorrowerProfileComponent},
        ]
      },
      {path: 'borrowers', component: BorrowerSearchPageComponent},
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class BorrowersRoutingModule {
}
