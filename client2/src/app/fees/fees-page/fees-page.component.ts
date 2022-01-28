import { Component, OnInit } from '@angular/core';
import { NotificationService } from "../../core/notification-service";
import { FeesService } from '../fees.service';
import { FormControl } from "@angular/forms";

@Component({
  selector: 'gsl-fees-page',
  templateUrl: './fees-page.component.html',
  styleUrls: ['./fees-page.component.css']
})
export class FeesPageComponent {
  readonly date = new FormControl(new Date());

  constructor(
    private notificationService: NotificationService,
    private feesService: FeesService) { }

  updateFees() {
    console.log('updating fees using date', this.date.value);
    this.feesService.updateFees(this.date.value)
      .subscribe(
        data => {
          this.notificationService.show('Fees updated!');
        },
        error => {
          this.notificationService.showError(error.data.status);
        }
      );
  }
}
