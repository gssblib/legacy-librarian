import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarcodeFieldComponent } from './barcode-field/barcode-field.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [
    BarcodeFieldComponent,
  ],
  exports: [
    BarcodeFieldComponent,
  ]
})
export class SharedModule { }
