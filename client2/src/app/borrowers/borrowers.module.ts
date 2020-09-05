import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyModule } from '@ngx-formly/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ConfirmationDialogModule } from '../shared/confirmation-dialog/confirmation-dialog.module';
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
import { BorrowerProfileEditComponent } from './borrower-profile-edit/borrower-profile-edit.component';
import { BorrowerSearchBarComponent } from './borrower-search-bar/borrower-search-bar.component';
import { BorrowerAddPageComponent } from './borrower-add-page/borrower-add-page.component';
import { BorrowerStatusComponent } from './borrower-status/borrower-status.component';
import { CdkTableModule } from '@angular/cdk/table';
import { RenewReturnDialogComponent } from "./borrower-checkouts/renew-return-dialog.component";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialogModule} from "@angular/material/dialog";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatSortModule} from "@angular/material/sort";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CdkTableModule,
    SharedModule,
    ConfirmationDialogModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
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
    RenewReturnDialogComponent,
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
  entryComponents: [
    RenewReturnDialogComponent,
  ],
})
export class BorrowersModule {
}
