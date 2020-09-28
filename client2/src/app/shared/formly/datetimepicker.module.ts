import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormlyDatetimepickerTypeComponent } from './datetimepicker.type';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from "@mat-datetimepicker/core";
import { MatDatepickerModule } from "@angular/material/datepicker";

@NgModule({
  declarations: [FormlyDatetimepickerTypeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,

    FormlyMatFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'datetimepicker',
          component: FormlyDatetimepickerTypeComponent,
        },
      ],
    }),
  ],
})
export class FormlyMatDatetimepickerModule {}
