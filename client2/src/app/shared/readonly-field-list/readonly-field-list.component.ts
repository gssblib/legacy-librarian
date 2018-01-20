import { Component, Input, OnInit } from '@angular/core';
import { ViewFormField } from '../../core/form.service';

@Component({
  selector: 'gsl-readonly-field-list',
  templateUrl: './readonly-field-list.component.html',
  styleUrls: ['./readonly-field-list.component.css']
})
export class ReadonlyFieldListComponent implements OnInit {
  @Input()
  model: any;

  @Input()
  fields: ViewFormField[];

  constructor() { }

  ngOnInit() {
  }

  getValue(field: ViewFormField): string {
    return this.model[field.name];
  }
}
