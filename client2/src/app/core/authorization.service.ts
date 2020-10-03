import { Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';

export class Action {
  constructor(readonly resource: string, readonly operation: string) {
  }

  static fromString(actionString: string): Action {
    const [resource, operation] = actionString.split('.');
    return new Action(resource, operation);
  }
}

function checkPermission(permission: any, action: Action): boolean {
  return permission.resource === action.resource &&
         permission.operations.includes(action.operation);
}

@Injectable()
export class AuthorizationService {

  constructor(private readonly authenticationService: AuthenticationService) {
  }

  /**
   * Returns a boolean indicating whether the current user is authorized
   * for the provided action.
   */
  isAuthorized(actionOrString: Action | string): boolean {
    const user = this.authenticationService.getUser();
    if (user === null) {
      return false;
    }
    const action: Action =
      actionOrString instanceof Action ? actionOrString : Action.fromString(actionOrString);

    return user.permissions.some(permission => checkPermission(permission, action));
  }
}
