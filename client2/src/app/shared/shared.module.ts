import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarcodeFieldComponent } from './barcode-field/barcode-field.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@angular/material";
import { IsbnFieldComponent } from './isbn-field/isbn-field.component';
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
  ],
  declarations: [
    BarcodeFieldComponent,
    IsbnFieldComponent,
  ],
  exports: [
    BarcodeFieldComponent,
    IsbnFieldComponent,
  ]
})
export class SharedModule { }
