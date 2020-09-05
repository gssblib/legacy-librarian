import { Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';

@Injectable()
export class Action {
  resource: string;
  operation: string;

  static fromString(actionString: string) {
    var split = actionString.split('.');
    return Object.assign(
      new Action(), {resource: split[0], operation: split[1]});
  }
}

@Injectable()
export class AuthorizationService {

  constructor(private authenticationService: AuthenticationService,) {
  }

  /**
   * Returns a boolean indicating whether the current user is authorized
   * for the provided action.
   */
  isAuthorized(action: Action | string): boolean {
    var user = this.authenticationService.getUser();
    if (user === null)
      return false;

    if (!(action instanceof Action))
      action = Action.fromString(action);

    for (var i = 0; i < user.permissions.length; ++i) {
      var permission = user.permissions[i];
      if (action.resource === permission.resource
        && permission.operations.indexOf(action.operation) >= 0) {
        return true;
      }
    }
    return false;
  }
}
