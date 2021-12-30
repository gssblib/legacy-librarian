import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateValueAccessorModule } from 'angular-date-value-accessor';
import { FeesService } from './fees.service';
import { FeesRoutingModule } from './fees-routing.module';
import { FeesPageComponent } from './fees-page/fees-page.component';
import { FeesTableComponent } from './fees-table/fees-table.component';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

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
    FeesRoutingModule,
  ],
  declarations: [
    FeesPageComponent,
    FeesTableComponent,
  ],
  providers: [
    FeesService,
  ],
  exports: []
})
export class FeesModule {
}
