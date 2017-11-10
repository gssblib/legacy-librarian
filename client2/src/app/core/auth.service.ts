import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

/**
 * JWT JSON object returned by the server.
 */
class JwtResponse {
  id: string;
  surname?: string;
  token: string;
}

/**
 * User information stored in local storage.
 */
class User {
  username: string;
  id: string;
  surname?: string;
  token: string;
}

/**
 * JWT based authentication service.
 */
@Injectable()
export class AuthenticationService {
  /** Local storage key for the current user. */
  private static USER_KEY = 'currentUser';

  /** JWT token obtained from the server. */
  public token: string;

  constructor(private httpClient: HttpClient) {
    // set token if saved in local storage
    var currentUser = AuthenticationService.getLocalUser();
    this.token = currentUser && currentUser.token;
  }

  /**
   * Tries to authenticate the user with the username and password.
   *
   * @returns Observable of the authentication result
   */
  login(username: string, password: string, type: string): Observable<boolean> {
    return this.httpClient.post('/api/authenticate', { username, password, type })
      .map((response: JwtResponse) => {
        // login successful if there's a jwt token in the response
        const token = response.token;
        if (token) {
          this.token = response.token;
          AuthenticationService.setLocalUser(this.toUser(username, response));
          return true;
        } else {
          return false;
        }
      });
  }

  private toUser(username: string, response: JwtResponse): User {
    return {
      username: username,
      token: response.token,
      surname: response.surname,
      id: response.id
    };
  }

  logout(): void {
    this.token = null;
    AuthenticationService.removeLocalUser();
  }

  getUser(): User {
    return AuthenticationService.getLocalUser();
  }

  private static getLocalUser(): User {
    return JSON.parse(localStorage.getItem(AuthenticationService.USER_KEY));
  }

  private static setLocalUser(user: User) {
    localStorage.setItem(AuthenticationService.USER_KEY, JSON.stringify(user));
  }

  private static removeLocalUser() {
    localStorage.removeItem(AuthenticationService.USER_KEY);
  }
}
