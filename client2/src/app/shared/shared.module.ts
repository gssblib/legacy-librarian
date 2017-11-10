import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { BarcodeFieldComponent } from './barcode-field/barcode-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsbnFieldComponent } from './isbn-field/isbn-field.component';
import { RouterModule } from '@angular/router';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyModule } from '@ngx-formly/core';
import { AutofocusDirective } from './focus/autofocus.directive';
import { FocusDirective } from './focus/focus.directive';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { MultiFieldSearchBarComponent } from './multi-field-search-bar/multi-field-search-bar.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule,
  ],
  declarations: [
    BarcodeFieldComponent,
    IsbnFieldComponent,
    AutofocusDirective,
    FocusDirective,
    MultiFieldSearchBarComponent,
  ],
  exports: [
    BarcodeFieldComponent,
    IsbnFieldComponent,
    MultiFieldSearchBarComponent,
    AutofocusDirective,
    FocusDirective,
  ]
})
export class SharedModule { }
