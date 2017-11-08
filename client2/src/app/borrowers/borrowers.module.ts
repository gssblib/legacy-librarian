import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { BorrowerPageComponent } from './borrower-page/borrower-page.component';
import { BorrowerSearchPageComponent } from './borrower-search-page/borrower-search-page.component';
import { BorrowersRoutingModule } from './borrowers-routing.module';
import { BorrowerCheckoutsComponent } from './borrower-checkouts/borrower-checkouts.component';
import { BorrowerFeesComponent } from './borrower-fees/borrower-fees.component';
import { BorrowerHistoryComponent } from './borrower-history/borrower-history.component';
import { BorrowerProfileComponent } from './borrower-profile/borrower-profile.component';
import { BorrowersService } from './shared/borrowers.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CovalentDataTableModule, CovalentPagingModule } from '@covalent/core';
import { SharedModule } from '../shared/shared.module';
import { BorrowerCheckoutsTableComponent } from './borrower-checkouts-table/borrower-checkouts-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BorrowerAutoCompleteComponent } from './borrower-auto-complete/borrower-auto-complete.component';
import { BorrowerService } from './shared/borrower.service';
import { BorrowerResolverService } from './shared/borrower.resolver.service';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTabsModule
} from '@angular/material';
import { BorrowerProfileEditComponent } from "./borrower-profile-edit/borrower-profile-edit.component";
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyModule } from '@ngx-formly/core';
import { BorrowerSearchBarComponent } from './borrower-search-bar/borrower-search-bar.component';
import { BorrowerSearchFormComponent } from './borrower-search-form/borrower-search-form.component';
import { BorrowerAddPageComponent } from './borrower-add-page/borrower-add-page.component';
import { BorrowerStatusComponent } from './borrower-status/borrower-status.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CovalentDataTableModule,
    CovalentPagingModule,
    BorrowersRoutingModule,
    SharedModule,
    MatCardModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule,
  ],
  declarations: [
    BorrowerPageComponent,
    BorrowerSearchPageComponent,
    BorrowerCheckoutsComponent,
    BorrowerFeesComponent,
    BorrowerHistoryComponent,
    BorrowerProfileComponent,
    BorrowerProfileEditComponent,
    BorrowerCheckoutsTableComponent,
    BorrowerAutoCompleteComponent,
    BorrowerSearchBarComponent,
    BorrowerSearchFormComponent,
    BorrowerAddPageComponent,
    BorrowerStatusComponent,
  ],
  providers: [
    BorrowerService,
    BorrowerResolverService,
    BorrowersService,
  ],
  exports: [
    BorrowerSearchBarComponent,
  ],
})
export class BorrowersModule {
}
