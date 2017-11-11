import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from './core/auth.service';
import { ErrorService } from './core/error-service';
import { NotificationService } from "./core/notification-service";

@Component({
  selector: 'gsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private snackbar: MatSnackBar,
    private errorService: ErrorService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.errorService.error.subscribe(error => {
      this.snackbar.open(error.message, 'Dismiss', {
        duration: 3000,
      });
    });
    this.notificationService.notification.subscribe(note => {
      this.snackbar.open(note.message, 'Dismiss', {
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
    this.router.navigate(['/login']);
  }

}

