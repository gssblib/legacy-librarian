import { Role, RoleRepository } from './auth';

const crud = ['create', 'read', 'update', 'delete'];

export const roleRepository: RoleRepository = new Map<string, Role>([
  ['anonymous', {permissions: []}],
  [
    'borrower',
    {
      permissions: [
        {
          resource: 'items',
          operations: ['read'],
        },
        {
          resource: 'ordercycles',
          operations: ['read'],
        },
        {
          resource: 'profile',
          operations: ['read'],
        },
        {
          resource: 'items',
          operations: ['order'],
          restrictions: [
            (user, permission, action) => {
              return parseInt(user.id, 10) ===
                  parseInt(action.params.borrower, 10);
            },
          ],
        },
      ]
    },
  ],
  [
    'clerk',
    {
      permissions: [
        {
          resource: 'items',
          operations: ['read', 'checkin', 'checkout', 'renew'],
        },
        {
          resource: 'borrowers',
          operations: ['read', 'payFees', 'renewAllItems'],
        },
      ]
    },
  ],
  [
    'librarian',
    {
      permissions: [
        {
          resource: 'items',
          operations: [...crud, 'checkin', 'checkout', 'renew', 'order'],
        },
        {
          resource: 'borrowers',
          operations: [...crud, 'payFees', 'renewAllItems'],
        },
        {
          resource: 'fees',
          operations: crud,
        },
        {
          resource: 'checkouts',
          operations: crud,
        },
        {
          resource: 'reports',
          operations: crud,
        },
        {
          resource: 'ordercycles',
          operations: crud,
        },
        {
          resource: 'orders',
          operations: crud,
        },
      ]
    },
  ],
]);