import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { Borrower } from "../shared/borrower";
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
    private router: Router,
    private notificationService: NotificationService,
    private borrowersService: BorrowersService,
  ) { }

  ngOnInit(): void {
    this.borrowersService.getFormlyFields().subscribe(fields => this.fields = fields);
  }

  submit() {
    this.borrowersService.save(this.borrower).subscribe(
      value => { this.notificationService.show("Borrower saved."); },
      error => { this.notificationService.showError("Failed saving borrower.", error)}
    );
  }

  delete() {
    const num = this.borrower.borrowernumber;
    this.borrowersService.remove(this.borrower).subscribe(
      borrower => { this.notificationService.show(`Borrower ${num} deleted.`) },
      error => { this.notificationService.showError("Failed to delete borrower..", error) }
    );
    this.router.navigate(['/borrowers']);
  }
}
