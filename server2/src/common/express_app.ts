import config from 'config';
import * as express from 'express';
import expressJwt from 'express-jwt';
import {AuthAction} from '../domain/auth';
import {isAuthorized, User} from '../domain/user';
import {isHttpError} from './error';

const jwtConfig: {secret: string} = config.get('jwt');

const jwtCheck = expressJwt({
  algorithms: ['HS256'],
  secret: jwtConfig.secret,
  credentialRequired: false
});

export enum HttpMethod {
  GET,
  PUT,
  PATCH,
  POST,
  DELETE,
}

type ExpressMiddleware =
    (req: express.Request, res: express.Response, next: express.NextFunction) =>
        void;

/**
 * Returns the express middleware that checks is the current user (obtained from
 * the request, set via jwt) has the permission to perform the `authAction`.
 */
function createAuthMiddleware(authAction: AuthAction): ExpressMiddleware {
  return (req, res, next) => {
    const user = req.user;
    if (user === undefined) {
      return res.status(401).send('NO_USER');
    }
    const appUser = user as User;
    if (appUser.permissions === undefined) {
      return res.status(401).send('NO_PERMISSIONS');
    }
    if (!isAuthorized(appUser, authAction)) {
      return res.status(401).send('NOT_AUTHORIZED');
    }
    return next();
  }
}

/**
 * Type for an express route handler.
 */
export type HttpHandlerFunction =
    (req: express.Request, res: express.Response) => void;

/**
 * Express route handler with metadata.
 */
export interface HttpHandler {
  method: HttpMethod;
  path: string;
  handle: HttpHandlerFunction;
  authAction?: AuthAction;
}

/**
 * Wrapper of an express `Aplication`.
 *
 * This wrapper encodes the conventions for handlers and other application
 * settings.
 */
export class ExpressApp {
  constructor(private readonly app: express.Application) {}

  private wrapHandler(handler: HttpHandler): HttpHandlerFunction {
    return async (req: express.Request, res: express.Response) => {
      try {
        await handler.handle(req, res);
      } catch (e) {
        console.log(`uncaught exception: ${JSON.stringify(e)}`);
        if (isHttpError(e)) {
          res.status(e.httpStatusCode);
          res.send({errorCode: e.code});
        } else {
          res.status(500);
          res.send({error: 'server error'});
        }
      }
    };
  }

  /**
   * Adds the express middleware for authorization to the `handler`.
   */
  private addAuth(handler: HttpHandler): ExpressMiddleware[] {
    // always add jwt
    const handlers: ExpressMiddleware[] = [jwtCheck];
    // if the handler has an auth action, check permissions
    if (handler.authAction) {
      handlers.push(createAuthMiddleware(handler.authAction));
    }
    // perform the actual handler last
    handlers.push(this.wrapHandler(handler));
    return handlers;
  }

  /**
   * Adds a handler for a route to the express `Application`.
   */
  addHandler(handler: HttpHandler): void {
    const handlers = this.addAuth(handler);
    switch (handler.method) {
      case HttpMethod.GET:
        this.app.get(handler.path, ...handlers);
        break;
      case HttpMethod.POST:
        this.app.post(handler.path, ...handlers);
        break;
      case HttpMethod.PUT:
        this.app.put(handler.path, ...handlers);
        break;
      case HttpMethod.PATCH:
        this.app.patch(handler.path, ...handlers);
        break;
      case HttpMethod.DELETE:
        this.app.delete(handler.path, ...handlers);
        break;
    }
  }
}