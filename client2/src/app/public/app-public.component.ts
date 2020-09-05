import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../core/auth.service';
import { Router } from "@angular/router";
import { NotificationService } from "../core/notification-service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'gsl-root',
  templateUrl: './app-public.component.html',
  styleUrls: ['./app-public.component.css']
})
export class AppPublicComponent implements OnInit {
  constructor(private snackBar: MatSnackBar,
              private notificationService: NotificationService,
              private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.notificationService.notification.subscribe(error => {
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
    this.router.navigate(['/login']);
  }
}

