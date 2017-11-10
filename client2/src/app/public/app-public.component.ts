import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ErrorService } from '../core/error-service';
import { AuthenticationService } from '../core/auth.service';

@Component({
  selector: 'gsl-root',
  templateUrl: './app-public.component.html',
  styleUrls: ['./app-public.component.css']
})
export class AppPublicComponent implements OnInit {
  constructor(
    private snackBar: MatSnackBar,
    private errorService: ErrorService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.errorService.error.subscribe(error => {
      this.snackBar.open(error.message, 'Dismiss', {
        duration: 3000,
      });
    });
  }

  get user() {
    var user = this.authenticationService.getUser();
    return this.authenticationService.getUser();
  }

  logout() {
    this.authenticationService.logout();
  }
}

