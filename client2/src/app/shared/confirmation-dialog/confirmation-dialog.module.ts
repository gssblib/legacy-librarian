import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogDirective } from './confirmation-dialog.directive';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

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
    ]
})
export class ConfirmationDialogModule { }
