import { Component } from '@angular/core';
import { FormControl } from "@angular/forms";
import { BorrowersService } from "../../borrowers/shared/borrowers.service";
import { BorrowerReminder } from "../../borrowers/shared/borrower";
import { NotificationService } from "../../core/notification-service";

@Component({
  selector: 'gsl-reminders-page',
  templateUrl: './reminders-page.component.html',
  styleUrls: ['./reminders-page.component.css']
})
export class RemindersPageComponent {
  readonly message = new FormControl();

  reminders: BorrowerReminder[] = [];

  constructor(
    private readonly borrowersService: BorrowersService,
    private readonly notificationService: NotificationService,
  ) {}

  generateReminders(): void {
    this.borrowersService.generateReminders().subscribe(reminders => {
      this.reminders = reminders;
    });
  }

  sendReminders(): void {
    this.borrowersService.sendReminders().subscribe(reminders => {
      this.notificationService.show(`${reminders.length} reminder emails sent`);
      this.reminders = reminders;
    });
  }
}
