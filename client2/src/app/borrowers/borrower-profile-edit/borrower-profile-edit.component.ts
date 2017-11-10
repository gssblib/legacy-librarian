import { Component, Input } from "@angular/core";
import { Borrower } from "../shared/borrower";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { NotificationService } from "../../core/notification-service";
import { BorrowersService } from "../shared/borrowers.service";

@Component({
  selector: 'gsl-borrower-profile-edit',
  templateUrl: './borrower-profile-edit.component.html',
  styleUrls: ['./borrower-profile-edit.component.css']
})
export class BorrowerProfileEditComponent {
  form = new FormGroup({});
  fields: Array<FormlyFieldConfig> = [];

  @Input()
  borrower: Borrower;

  constructor(
    private notificationService: NotificationService,
    private borrowersService: BorrowersService,
  ) { }

  ngOnInit(): void {
    this.borrowersService.getBorrowerFields().subscribe(fields => this.fields = fields);
  }

  submit(borrower) {
    this.borrowersService.saveBorrower(this.borrower).subscribe(
      value => { this.notificationService.show("Borrower saved."); },
      error => { this.notificationService.showError("Failed saving borrower.", error)}
    );
  }
}
