import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { BorrowerQuery } from "../shared/borrower-query";
import { Router } from "@angular/router";

@Component({
  selector: 'gsl-borrower-search-form',
  templateUrl: './borrower-search-form.component.html',
  styleUrls: ['./borrower-search-form.component.css']
})
export class BorrowerSearchFormComponent implements OnInit {
  @Input()
  criteria: Object;

  @Output()
  search: EventEmitter<BorrowerQuery> = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSubmit(query) {
    console.log('query: ' + JSON.stringify(query));
    this.search.emit(this.toCriteria(query));
  }

  private toCriteria(query) {
    const criteria: any = {};
    for (let field of ['surname', 'email']) {
      if (query[field] !== '') {
        criteria[field] = query[field];
      }
    }
    return criteria;
  }

}
