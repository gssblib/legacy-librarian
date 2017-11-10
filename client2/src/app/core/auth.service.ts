import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'


@Injectable()
export class AuthenticationService {
  public token: string;

  constructor(private httpClient: HttpClient) {
    // set token if saved in local storage
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.httpClient.post('/api/authenticate',
                                { username: username, password: password })
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let token = response['token'];
        if (token) {
          this.token = token;
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              username: username,
              token: token,
              surname: response['surname'],
              id: response['id'] }));
          return true;
        } else {
          return false;
        }
      });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }

  getUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
}
