import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarcodeFieldComponent } from './barcode-field/barcode-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsbnFieldComponent } from './isbn-field/isbn-field.component';
import { RouterModule } from '@angular/router';
import { AutofocusDirective } from './focus/autofocus.directive';
import { FocusDirective } from './focus/focus.directive';
import { MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  declarations: [
    BarcodeFieldComponent,
    IsbnFieldComponent,
    AutofocusDirective,
    FocusDirective,
  ],
  exports: [
    BarcodeFieldComponent,
    IsbnFieldComponent,
    AutofocusDirective,
    FocusDirective,
  ]
})
export class SharedModule { }
