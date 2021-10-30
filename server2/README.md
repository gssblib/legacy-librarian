# GSSB library server using express, ts-node, and mysql2

To start the server with nodemon (automatically restarting the server
when a source file changes), call `npm start` which in turn will call
`npm nodemon src/main.ts`.

To start without nodemon, call `npx ts-node src/main.ts`.

Set `NODE_CONFIG_DIR` and `NODE_ENV` to pick up the configuration.
