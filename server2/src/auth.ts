
/**
 * A `Role` is a set of `Permissions`.
 */
export interface Role {
  permissions: Permission[];
}

/**
 * Describes an action that a user wants to perform.
 */
export interface Action {
  resource: string;
  operation: string;
  params: any;
}

/**
 * Function that allows adding arbitrary conditions to a `Permission`.
 */
type Restriction = (user: any, permission: Permission, action: Action) =>
    boolean;

/**
 * A `Permission` allows to perform some operations on a resource.
 */
export interface Permission {
  resource: string;
  operations: string[];
  restrictions?: Restriction[];
}

export type RoleRepository = Map<string, Role>;

export function getPermissions(
    repository: RoleRepository, roleNames: string[]|string): Permission[] {
  if (!Array.isArray(roleNames)) {
    roleNames = roleNames.split(',');
  }
  return roleNames.map(roleName => repository.get(roleName))
      .flatMap(role => role && role.permissions || []);
}