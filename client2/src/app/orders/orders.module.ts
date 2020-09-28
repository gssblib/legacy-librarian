import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderCyclePageComponent } from './order-cycle-page/order-cycle-page.component';
import { OrderCyclesPageComponent } from './order-cycles-page/order-cycles-page.component';
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CoreModule } from "../core/core.module";
import { OrderCycleAddPageComponent } from './order-cycle-add-page/order-cycle-add-page.component';
import { ReactiveFormsModule } from "@angular/forms";
import { FormlyModule } from "@ngx-formly/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDatetimepickerModule } from "@mat-datetimepicker/core";
import { OrderCycleEditPageComponent } from './order-cycle-edit-page/order-cycle-edit-page.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { ConfirmationDialogModule } from "../shared/confirmation-dialog/confirmation-dialog.module";
import { RouterModule } from "@angular/router";
import { OrderPageComponent } from './order-page/order-page.component';
import { OrdersPageComponent } from './orders-page/orders-page.component';

/**
 * Module providing the components for the order management.
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatetimepickerModule,
    MatIconModule,
    MatTableModule,
    CoreModule,
    FormlyModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTooltipModule,
    ConfirmationDialogModule,
    RouterModule,
  ],
  declarations: [
    OrderCyclePageComponent,
    OrderCyclesPageComponent,
    OrderCycleAddPageComponent,
    OrderCycleEditPageComponent,
    OrderPageComponent,
    OrdersPageComponent,
  ],
  exports: [
    OrderCyclesPageComponent,
  ],
})
export class OrdersModule {
}
