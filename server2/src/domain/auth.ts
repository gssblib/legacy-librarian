
/**
 * A `Role` is a set of `Permissions`.
 */
export interface AuthRole {
  permissions: Permission[];
}

/**
 * Describes an action that a user wants to perform.
 */
export interface AuthAction {
  resource: string;
  operation: string;
  params?: any;
}

/**
 * Function that allows adding arbitrary conditions to a `Permission`.
 */
type AuthRestriction =
    (user: any, permission: Permission, action: AuthAction) => boolean;

/**
 * A `Permission` allows to perform some operations on a resource.
 */
export interface Permission {
  resource: string;
  operations: string[];
  restrictions?: AuthRestriction[];
}

export type AuthRoleRepository = Map<string, AuthRole>;

export function getPermissions(
    repository: AuthRoleRepository, roleNames: string[]|string): Permission[] {
  if (!Array.isArray(roleNames)) {
    roleNames = roleNames.split(',');
  }
  return roleNames.map(roleName => repository.get(roleName))
      .flatMap(role => role && role.permissions || []);
}