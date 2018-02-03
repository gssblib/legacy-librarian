import { Component, OnInit } from '@angular/core';
import { Borrower } from "../shared/borrower";
import { BorrowerService } from "../shared/borrower.service";
import { BorrowersService } from '../shared/borrowers.service';
import { ViewFormField } from '../../core/form.service';
import { AuthorizationService } from '../../core/authorization.service';

/**
 * Presents a borrowers names and contact information.
 */
@Component({
  selector: 'gsl-borrower-profile',
  templateUrl: './borrower-profile.component.html',
  styleUrls: ['./borrower-profile.component.css']
})
export class BorrowerProfileComponent implements OnInit {
  editable: boolean;
  borrower: Borrower = null;
  fields: ViewFormField[];

  constructor(private borrowerService: BorrowerService,
              private borrowersService: BorrowersService,
              private authorizationService: AuthorizationService) {
    this.borrowerService.subscribe(borrower => this.borrower = borrower);
    this.editable = authorizationService.isAuthorized('borrowers.update');
  }

  ngOnInit() {
    this.borrower = this.borrowerService.get();
    this.borrowersService.getViewFields().subscribe(fields => this.fields = fields);
  }
}
