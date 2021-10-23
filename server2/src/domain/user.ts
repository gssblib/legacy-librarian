import {AuthAction, getPermissions, Permission} from './auth';
import {roleRepository} from './roles';

export interface User {
  type: string;
  username: string;
  roles: string[];
  permissions: Permission[];
  token?: string;
  id?: string;
  surname?: string;
}

/**
 * Returns true if the `permission` permits the `action`.
 */
export function checkPermission(
    user: User, permission: Permission, action: AuthAction): boolean {
  if (permission.resource !== action.resource) {
    return false;
  }
  if (!permission.operations.includes(action.operation)) {
    return false;
  }
  const restrictions = permission.restrictions || [];
  if (restrictions.length === 0) {
    return true;
  }
  return restrictions.every(
      restriction => restriction(user, permission, action));
}

/**
 * Returns true if the action is authorized by the permissions.
 */
export function isAuthorized(user: User, action: AuthAction): boolean {
  const permissions = getPermissions(roleRepository, user.roles);
  const authorized =
      permissions.some(permission => checkPermission(user, permission, action));
  if (!authorized) {
    console.log(
        `user ${JSON.stringify(user)} not authorized to perform action ${
            JSON.stringify(action)}`);
  }
  return authorized;
};