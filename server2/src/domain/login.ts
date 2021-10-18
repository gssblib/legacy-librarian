import config from 'config';
import * as crypto from 'crypto';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import {getPermissions} from './auth';
import {db} from './library';
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

/**
 * Authenticates a user given the `login` against the database.
 *
 * If authenticated, returns the user with roles and permissions.
 */
async function authenticate(login: Login): Promise<AuthenticationResult> {
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
