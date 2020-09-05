import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../core/auth.service';

@Component({
  selector: 'gsl-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  /** Authentication type sent to the server with the credentials. */
  type: string;

  model: any = {};
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
  }

  login() {
    this.loading = true;
    this.authenticationService.login(
      this.model.username, this.model.password, this.type).subscribe(
      result => {
        if (result === true) {
          this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate([params['returnUrl'] || '/'])});
        } else {
          this.error = 'Username or password is incorrect';
          this.loading = false;
        }
      },
      error => {
        this.error = 'Username or password is incorrect';
        this.loading = false;
      }
    );
  }
}


@Component({
    selector: 'gsl-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css']
})
export class SycamoreLoginPageComponent extends LoginPageComponent {
  type = 'sycamore';
}


@Component({
    selector: 'gsl-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css']
})
export class InternalLoginPageComponent extends LoginPageComponent {
  type = 'internal';
}
