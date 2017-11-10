import { Component, OnInit } from '@angular/core';
import { NotificationService } from "../../core/notification-service";
import { FeesService } from '../fees.service';

@Component({
  selector: 'gsl-fees-page',
  templateUrl: './fees-page.component.html',
  styleUrls: ['./fees-page.component.css']
})
export class FeesPageComponent implements OnInit {
  date: Date;

  constructor(
    private notificationService: NotificationService,
    private feesService: FeesService) { }

  ngOnInit() {
    this.date = new Date();
  }

  updateFees(date) {
    this.feesService.updateFees(date)
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
