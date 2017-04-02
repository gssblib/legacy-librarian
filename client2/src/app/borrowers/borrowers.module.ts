import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowerPageComponent } from './borrower-page/borrower-page.component';
import { BorrowerSearchPageComponent } from './borrower-search-page/borrower-search-page.component';
import { RouterModule } from "@angular/router";
import { BorrowersRoutingModule } from "./borrowers-routing.module";
import { BorrowerCheckoutsComponent } from './borrower-checkouts/borrower-checkouts.component';
import { BorrowerFeesComponent } from './borrower-fees/borrower-fees.component';
import { BorrowerHistoryComponent } from './borrower-history/borrower-history.component';
import { BorrowerProfileComponent } from './borrower-profile/borrower-profile.component';
import { BorrowersService } from "./shared/borrowers.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@angular/material";
import { CovalentDataTableModule } from "@covalent/core";
import { SharedModule } from "../shared/shared.module";
import { BorrowerCheckoutsTableComponent } from './borrower-checkouts-table/borrower-checkouts-table.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    CovalentDataTableModule,
    BorrowersRoutingModule,
    SharedModule
  ],
  declarations: [
    BorrowerPageComponent,
    BorrowerSearchPageComponent,
    BorrowerCheckoutsComponent,
    BorrowerFeesComponent,
    BorrowerHistoryComponent,
    BorrowerProfileComponent,
    BorrowerCheckoutsTableComponent
  ],
  providers: [
    BorrowersService,
  ]
})
export class BorrowersModule {
}
