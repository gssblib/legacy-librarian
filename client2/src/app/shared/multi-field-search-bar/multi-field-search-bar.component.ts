import { Component, EventEmitter, OnInit, Input, Output, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { FormlyFieldConfig } from "@ngx-formly/core";
import { Observable } from "rxjs";

/**
 * Search bar with formly form fields.
 */
@Component({
  selector: 'gsl-multi-field-search-bar',
  templateUrl: './multi-field-search-bar.component.html',
  styleUrls: ['./multi-field-search-bar.component.css']
})
export class MultiFieldSearchBarComponent implements OnInit, OnChanges {
  @Input()
  criteria: Object;

  @Input('fields')
  fieldsObservable: Observable<FormlyFieldConfig[]>;

  fields: FormlyFieldConfig[] = [];

  @Output()
  search: EventEmitter<Object> = new EventEmitter();

  form: FormGroup;

  constructor(fb: FormBuilder) {
    this.form = fb.group({});
  }

  ngOnInit() {
    this.fieldsObservable.subscribe(fields => this.fields = fields);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.form.reset(this.criteria);
  }

  onSubmit(query) {
    this.search.emit(this.toCriteria(query));
  }

  onReset() {
    this.form.reset({});
    this.search.emit(this.toCriteria({}));
  }

  /**
   * Translates the search form fields to the search criteria sent to the server.
   */
  private toCriteria(query) {
    const criteria: any = {};
    for (let field of this.fields) {
      const key = field.key as string;
      if (query[key] !== '') {
        criteria[key] = query[key];
      }
    }
    return criteria;
  }
}
