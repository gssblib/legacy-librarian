import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { NotificationService } from "../../core/notification-service";
import { BorrowersService } from "../shared/borrowers.service";
import { Borrower } from "../shared/borrower";

@Component({
  selector: 'gsl-borrower-add-page',
  templateUrl: './borrower-add-page.component.html',
  styleUrls: ['./borrower-add-page.component.css']
})
export class BorrowerAddPageComponent implements OnInit {
  form = new FormGroup({});
  borrower = {};
  fields: Array<FormlyFieldConfig> = [];

  constructor(
    private notificationService: NotificationService,
    private borrowersService: BorrowersService,
    private router: Router) { }

  ngOnInit() {
    this.borrowersService.getBorrowerFields().subscribe(fields => this.fields = fields);
  }

  submitForm(borrower) {
    this.borrowersService.addBorrower(borrower).subscribe(
      value => {
        this.router.navigate(['/borrowers', value.borrowernumber, 'checkouts']);
      },
      error => {
        this.notificationService.showError('Saving borrower failed', error);
      }
    );
  }

}
