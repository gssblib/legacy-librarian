import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateValueAccessorModule } from 'angular-date-value-accessor';
import { FeesService } from './fees.service';
import { FeesRoutingModule } from './fees-routing.module';
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
    FeesRoutingModule,
    DateValueAccessorModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    FeesPageComponent,
    FeesTableComponent,
  ],
  providers: [
    FeesService,
  ],
  exports: [
  ]
})
export class FeesModule { }
