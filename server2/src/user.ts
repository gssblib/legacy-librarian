import { Action, getPermissions, Permission } from "./auth";
import { roleRepository } from "./roles";

export interface User {
  type: string;
  username: string;
  roles: string[];
  permissions: Permission[];
  token?: string;
}

/**
 * Returns true if the `permission` permits the `action`.
 */
export function checkPermission(user: User, permission: Permission, action: Action): boolean {
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
export function isAuthorized(user: User, action: Action): boolean {
  const permissions = getPermissions(roleRepository, user.roles);
  return permissions.some(
      permission => checkPermission(user, permission, action));
};