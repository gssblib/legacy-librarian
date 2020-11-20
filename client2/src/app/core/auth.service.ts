import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subject, from,of, EMPTY } from 'rxjs';
import { catchError, map, switchMap,take } from 'rxjs/operators';


/**
 * JWT JSON object returned by the server.
 */
interface JwtResponse {
  username: string;
  token: string;
  roles: string;
  permissions: any;
  customToken: string; // Firebase Auth custom token
  // Sycamore user specified
  id?: string;  // borrower number
  surname?: string; // Surname as stored on borrower
}

/**
 * User information stored in local storage.
 */
export interface User {
  username: string;
  token: string;
  roles: string;
  permissions: any;
  // Sycamore user specified
  id?: string;  // borrower number
  surname?: string; // Surname as stored on borrower
}

/**
 * JWT based authentication service.
 */
@Injectable()
export class AuthenticationService {
  /** Local storage key for the current user. */
  private static USER_KEY = 'currentUser';

  user: User;

  /** Subject tracking the current user. */
  private userSubject = new Subject<User>();

  /** Observable that any page accessing the user can listen to. */
  userObservable = this.userSubject.asObservable();

  /** JWT token obtained from the server. */
  public get token(): string {
    return this.user.token;
  }

  constructor(private httpClient: HttpClient, private auth: AngularFireAuth) {
    this.user = this.getUser();
    this.userSubject.next(this.user);
    this.userObservable.subscribe(user => this.user = user);
  }

  /**
   * Tries to authenticate the user with the username and password.
   *
   * @returns Observable of the authentication result
   */
  login(username: string, password: string, type: string): Observable<boolean> {
    return this.httpClient.post('/api/authenticate', { username, password, type })
      .pipe(
        switchMap((response: JwtResponse) => {
        // login successful if there's a jwt token in the response
        const token = response.token;
        if (token) {
          console.log("API login successful");
          return from(this.auth.signInWithCustomToken(response.customToken)).pipe(
              map(userCreds => {
                console.log("Firebase login successful");
                const user = this.toUser(username, response);
                AuthenticationService.setLocalUser(user);
                this.userSubject.next(user);
                return true;
              }),
              catchError((error) => {
              console.log("Firebase login failure:", error);
                return of(false);
              }),
          );
        } else {
          console.log("API login failure");
          return of(false);
        }
      }));
  }

  private toUser(username: string, response: JwtResponse): User {
    return {
      ...response,
      username,
    };
  }

  logout(): void {
    AuthenticationService.removeLocalUser();
    this.userSubject.next(null);
    from(this.auth.signOut()).pipe(
      take(1),
      catchError( error => {
        console.log("Firebase logout failure:", error)
        return EMPTY;
      }),
    ).subscribe(()=>{
      console.log("Firebase logout successful");
    });
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
