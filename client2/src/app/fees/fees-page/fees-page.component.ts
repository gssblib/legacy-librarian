import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FeesService } from '../fees.service';

@Component({
  selector: 'gsl-fees-page',
  templateUrl: './fees-page.component.html',
  styleUrls: ['./fees-page.component.css']
})
export class FeesPageComponent implements OnInit {
  date: Date;

  constructor(
    private snackbar: MatSnackBar,
    private feesService: FeesService) { }

  ngOnInit() {
    this.date = new Date();
  }

  updateFees(date) {
    this.feesService.updateFees(date)
      .subscribe(
        data => {
          this.snackbar.open(
            'Fees updated!', 'Dismiss', {'extraClasses': ['success']});
        },
        error => {
          this.snackbar.open(
            error.data.status, 'Dismiss', {'extraClasses': ['error']});
        }
      );
  }
}
