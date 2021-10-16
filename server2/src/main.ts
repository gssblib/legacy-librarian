import bodyParser from 'body-parser';
import config from 'config';
import cookieParser from 'cookie-parser';
import express from 'express';
import expressJwt from 'express-jwt';
import * as library from './domain/library';
import * as login from './domain/login';

const serverConfig: {port: number} = config.get('server');
const port = serverConfig.port;

console.log(`Starting library server on port ${port}`);
const app: express.Application = express();
const authConfig: {cookie: string} = config.get('auth');

app.use(bodyParser.json());
app.use(cookieParser(authConfig.cookie));

login.initRoutes(app);
library.initRoutes(app);

const jwtConfig: {secret: string} = config.get('jwt');
app.use(expressJwt({
  audience: '/api',
  algorithms: ['HS256'],
  secret: jwtConfig.secret,
  credentialRequired: false
}));

app.listen(3000, () => {
  console.log(`The application is listening on port ${port}!`);
});
