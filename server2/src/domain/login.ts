import config from 'config';
import * as crypto from 'crypto';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import needle from 'needle';
import {getPermissions} from './auth';
import {borrowers, db} from './library';
import {roleRepository} from './roles';
import {User} from './user';

function hash(s: string): string {
  return crypto.createHash('sha256').update(s).digest('hex');
}

function saltedHash(s: string): string {
  const authConfig: {salt: string} = config.get('auth');
  return hash(authConfig.salt + s);
}

interface Login {
  username: string;
  password: string;
  type: string;
}

interface AuthenticationResult {
  authenticated: boolean;
  user?: User;
  reason?: string;
}

interface UserRow {
  username: string;
  hashed_password: string;

  /** Comma-separated list of role of the user. */
  roles: string;
}

interface SycamoreConfig {
  'school-id': string;
  url: string;
  'success-text': string;
}

const sycamoreConfig = config.get('sycamore-auth') as SycamoreConfig;

type AuthenticationFn = (login: Login) => Promise<AuthenticationResult>;

const authenticationFns = new Map<string, AuthenticationFn>([
  ['internal', authenticateInternal],
  ['sycamore', authenticateSycamore],
]);

async function authenticate(login: Login): Promise<AuthenticationResult> {
  const authenticationFn = authenticationFns.get(login.type);
  return authenticationFn ? authenticationFn(login) : {authenticated: false};
}

/**
 * Authenticates a user given the `login` against the database.
 *
 * If authenticated, returns the user with roles and permissions.
 */
async function authenticateInternal(login: Login):
    Promise<AuthenticationResult> {
  const row = await db.selectRow(
      'select * from users where username = ?', [login.username]);
  if (!row) {
    return {authenticated: false, reason: 'UNKNOWN_USER'};
  }
  const userRow = row as UserRow;
  if (saltedHash(login.password) !== userRow.hashed_password) {
    return {authenticated: false, reason: 'INCORRECT_PASSWORD'};
  }
  const roles = userRow.roles.split(',');
  const permissions = getPermissions(roleRepository, roles);
  return {
    authenticated: true,
    user: {
      type: 'internal',
      username: userRow.username,
      roles,
      permissions,
    }
  };
}

async function authenticateSycamore(login: Login):
    Promise<AuthenticationResult> {
  const sycamoreid = login.username;
  const borrower = await borrowers.find({fields: {sycamoreid}});
  if (!borrower) {
    return {
      authenticated: false,
    };
  }
  const formData = {
    entered_schid: sycamoreConfig['school-id'],
    entered_login: login.username,
    entered_password: login.password,
  };
  const response = await needle('post', sycamoreConfig.url, formData);
  const body: string = response.body;
  if (!body.includes(sycamoreConfig['success-text'])) {
    return {
      authenticated: false,
    };
  }
  const roles = ['borrower'];
  const permissions = getPermissions(roleRepository, roles);
  return {
    authenticated: true,
    user: {
      type: 'sycamore',
      username: login.username,
      roles,
      permissions,
      id: `${borrower.borrowernumber}`,
      surname: borrower.surname,
    },
  };
}

export function initRoutes(app: express.Application): void {
  const jwtConfig: {secret: string} = config.get('jwt');
  app.post('/api/authenticate', async (req, res) => {
    const login = req.body as Login;
    const result = await authenticate(login);
    if (result.authenticated) {
      const user = result.user!;
      user.token = jwt.sign(user, jwtConfig.secret, {algorithm: 'HS256'});
      res.send(user);
    } else {
      res.status(401);
      res.send(result);
    }
  })
}
