import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { RemindersPageComponent } from './reminders-page/reminders-page.component';
import { RemindersRoutingModule } from './reminders-routing.module';
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RemindersTableComponent } from './reminders-table/reminders-table.component';
import { MatTableModule } from "@angular/material/table";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatPaginatorModule } from "@angular/material/paginator";
import { ConfirmationDialogModule } from "../shared/confirmation-dialog/confirmation-dialog.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    ConfirmationDialogModule,
    RemindersRoutingModule,
  ],
  declarations: [
    RemindersPageComponent,
    RemindersTableComponent,
  ],
})
export class RemindersModule {
}
