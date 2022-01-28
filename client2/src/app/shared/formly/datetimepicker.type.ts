import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatetimepickerComponent } from "@mat-datetimepicker/core";

/**
 * Formly forms type component for the mat-datetimepicker.
 *
 * Formly forms' type component for the Angular Material datepicker uses the
 * form-field wrapper. When attempting the same approach for the datetimepicker
 * we ended up with an empty datetimepicker popup (looking like the calendar
 * data was missing).
 *
 * We therefore include the mat-form-field in this component which is simpler
 * and more readable anyway.
 */
@Component({
  selector: 'formly-field-mat-datetimepicker',
  template: `
    <mat-form-field class="field">
      <mat-label>{{to.label}}</mat-label>
      <input
        matInput
        [id]="id"
        [errorStateMatcher]="errorStateMatcher"
        [formControl]="formControl"
        [matDatetimepicker]="picker"
        [formlyAttributes]="field"
        [placeholder]="to.placeholder"
        [tabindex]="to.tabindex"
        [readonly]="to.readonly"
        [required]="to.required"
        (dateInput)="to.datepickerOptions.dateInput(field, $event)"
        (dateChange)="to.datepickerOptions.dateChange(field, $event)"
      />
      <mat-datetimepicker-toggle matSuffix [for]="picker"></mat-datetimepicker-toggle>
      <mat-datetimepicker #picker type="datetime"></mat-datetimepicker>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyDatetimepickerTypeComponent extends FieldType implements AfterViewInit {
  @ViewChild(MatInput, { static: true }) formFieldControl!: MatInput;
  @ViewChild(MatDatetimepickerComponent, { static: true }) input!: MatDatetimepickerComponent<any>;

  defaultOptions = {
    templateOptions: {
      datepickerOptions: {
        dateInput: () => {},
        dateChange: () => {},
        monthSelected: () => {},
        yearSelected: () => {},
      },
    },
  };

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }
}
