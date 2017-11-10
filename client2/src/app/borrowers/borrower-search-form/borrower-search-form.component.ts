import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormlyFieldConfig } from "@ngx-formly/core";
import { BorrowerQuery } from "../shared/borrower-query";
import { BorrowersService } from "../shared/borrowers.service";

@Component({
  selector: 'gsl-borrower-search-form',
  templateUrl: './borrower-search-form.component.html',
  styleUrls: ['./borrower-search-form.component.css']
})
export class BorrowerSearchFormComponent implements OnInit {
  @Input()
  criteria: Object;

  @Input('fields')
  shownFields: string[] = ['surname', 'firstname', 'emailaddress', 'state'];

  @Output()
  search: EventEmitter<BorrowerQuery> = new EventEmitter();

  fields: Array<FormlyFieldConfig> = [];

  constructor(
    private borrowersService: BorrowersService,
  ) { }

  ngOnInit() {
    this.borrowersService.getBorrowerFields().subscribe(
      fields => {
        this.fields = fields
          .filter(field => this.shownFields.includes(field.key))
          .sort((f1, f2) => this.shownFields.indexOf(f1.key) - this.shownFields.indexOf(f2.key));
      }
    );
  }

  onSubmit(query) {
    this.search.emit(this.toCriteria(query));
  }

  onReset() {
    this.criteria = {};
  }

  private toCriteria(query) {
    const criteria: any = {};
    for (let field of this.shownFields) {
      if (query[field] !== '') {
        criteria[field] = query[field];
      }
    }
    return criteria;
  }

}
