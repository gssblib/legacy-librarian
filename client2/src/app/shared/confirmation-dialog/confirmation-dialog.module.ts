import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogDirective } from './confirmation-dialog.directive';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import {
  MatDialogModule,
  MatButtonModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  declarations: [
    ConfirmationDialogDirective,
    ConfirmationDialogComponent,
  ],
  exports: [
    ConfirmationDialogDirective,
  ],
  entryComponents: [
    ConfirmationDialogComponent,
  ]
})
export class ConfirmationDialogModule { }
