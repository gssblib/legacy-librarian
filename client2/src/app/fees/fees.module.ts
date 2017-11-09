import { NgModule } from "@angular/core";
import { DatePipe, CurrencyPipe, CommonModule } from "@angular/common";
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CovalentDataTableModule, CovalentPagingModule } from '@covalent/core';
import { DateValueAccessorModule } from 'angular-date-value-accessor';
import { FeesService } from "./fees.service";
import { FeesRoutingModule } from "./fees-routing.module";
import { FeesPageComponent } from './fees-page/fees-page.component';
import { FeesTableComponent } from './fees-table/fees-table.component';

/**
 * Angular module for the fees owed to the library.
 *
 * The module provides the FeesService communicating the backend and the components
 * for viewing and updating fees.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CovalentDataTableModule,
    CovalentPagingModule,
    FeesRoutingModule,
    DateValueAccessorModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
  ],
  declarations: [
    FeesPageComponent,
    FeesTableComponent,
  ],
  providers: [
    DatePipe,
    CurrencyPipe,
    FeesService,
  ],
  exports: [
  ]
})
export class FeesModule { }
