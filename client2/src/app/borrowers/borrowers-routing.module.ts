import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BorrowerPageComponent } from "./borrower-page/borrower-page.component";
import { BorrowerSearchPageComponent } from "./borrower-search-page/borrower-search-page.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'borrowers/:id', component: BorrowerPageComponent },
      { path: 'borrowers', component: BorrowerSearchPageComponent },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class BorrowersRoutingModule {
}
