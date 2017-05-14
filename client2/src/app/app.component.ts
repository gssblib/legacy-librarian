import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { ErrorService } from './core/error-service';

@Component({
  selector: 'gsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private snackbar: MdSnackBar, private errorService: ErrorService) {}

  ngOnInit(): void {
    this.errorService.error.subscribe(error => {
      this.snackbar.open(error.message, 'Dismiss', {
        duration: 3000,
      });
    });
  }
}

