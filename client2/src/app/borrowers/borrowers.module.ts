import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTabsModule
} from '@angular/material';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyModule } from '@ngx-formly/core';
import { CovalentDataTableModule, CovalentPagingModule } from '@covalent/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ConfirmationDialogModule } from "../shared/confirmation-dialog/confirmation-dialog.module";
import { ItemsModule } from '../items/items.module';
import { BorrowersService } from './shared/borrowers.service';
import { BorrowerService } from './shared/borrower.service';
import { BorrowerResolverService } from './shared/borrower.resolver.service';
import { BorrowerCheckoutsTableComponent } from './borrower-checkouts-table/borrower-checkouts-table.component';
import { BorrowerPageComponent } from './borrower-page/borrower-page.component';
import { BorrowerSearchPageComponent } from './borrower-search-page/borrower-search-page.component';
import { BorrowerCheckoutsComponent } from './borrower-checkouts/borrower-checkouts.component';
import { BorrowerFeesComponent } from './borrower-fees/borrower-fees.component';
import { BorrowerHistoryComponent } from './borrower-history/borrower-history.component';
import { BorrowerProfileComponent } from './borrower-profile/borrower-profile.component';
import { BorrowerAutoCompleteComponent } from './borrower-auto-complete/borrower-auto-complete.component';
import { BorrowerProfileEditComponent } from "./borrower-profile-edit/borrower-profile-edit.component";
import { BorrowerSearchBarComponent } from './borrower-search-bar/borrower-search-bar.component';
import { BorrowerAddPageComponent } from './borrower-add-page/borrower-add-page.component';
import { BorrowerStatusComponent } from './borrower-status/borrower-status.component';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CovalentDataTableModule,
    CovalentPagingModule,
    SharedModule,
    ConfirmationDialogModule,
    MatCardModule,
    MatChipsModule,
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
    RouterModule,
    ItemsModule,
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
    BorrowerCheckoutsTableComponent
  ],
})
export class BorrowersModule {
}
