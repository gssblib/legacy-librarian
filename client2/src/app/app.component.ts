import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from './core/auth.service';
import { NotificationService } from "./core/notification-service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'gsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private readonly router: Router,
              private readonly snackbar: MatSnackBar,
              private readonly authenticationService: AuthenticationService,
              private readonly notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.notificationService.notification.subscribe(note => {
      this.snackbar.open(note.message, 'Dismiss', {
        duration: 3000,
      });
    });
  }

  get user() {
    return this.authenticationService.getUser();
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}

