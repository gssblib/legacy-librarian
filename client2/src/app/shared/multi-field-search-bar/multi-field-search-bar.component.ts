import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormlyFieldConfig } from "@ngx-formly/core";
import { Observable } from "rxjs";

@Component({
  selector: 'gsl-multi-field-search-bar',
  templateUrl: './multi-field-search-bar.component.html',
  styleUrls: ['./multi-field-search-bar.component.css']
})
export class MultiFieldSearchBarComponent implements OnInit {
  @Input()
  criteria: Object;

  @Input('fields')
  fieldsObservable: Observable<Array<FormlyFieldConfig>>;

  fields: Array<FormlyFieldConfig> = [];

  @Output()
  search: EventEmitter<Object> = new EventEmitter();

  constructor( ) { }

  ngOnInit() {
    this.fieldsObservable.subscribe(fields => this.fields = fields);
  }

  onSubmit(query) {
    this.search.emit(this.toCriteria(query));
  }

  onReset() {
    this.criteria = {};
  }

  private toCriteria(query) {
    const criteria: any = {};
    for (let field of this.fields) {
      if (query[field.key] !== '') {
        criteria[field.key] = query[field.key];
      }
    }
    return criteria;
  }

}
