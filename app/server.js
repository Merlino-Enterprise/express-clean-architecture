/*
 * Copyright (c) 2021 Merlino Enterprise Sdn. Bhd.
 * All rights reserved.
 */

import http from 'http';
import cluster from 'cluster';
import os from 'os';

import {createLogger} from 'logger';
import app from 'app';

const numCPUs = os.cpus().length;

// Log module status
const logger = createLogger('server.js');

if (cluster.isMaster) {
  logger.info(`Master ${process.pid} is running`);

  // Fork workers
  Array(numCPUs).fill(0).forEach(() => cluster.fork());

  cluster.on('exit', (worker, code, signal) => {
    logger.info(`worker ${worker.process.pid} died with signal ${signal} and code ${code}`);
  });
} else {
  // Setup and start the HTTP server
  const server = http.createServer(app);
  server.on('listening', () => {
    const {port, address} = server.address();
    logger.info({host: address.host, port}, `Server listening on port ${port}`);
  });

  server.on('error', (error) => {
    logger.error({err: error}, 'HTTP server error');
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection at:', reason.stack || reason);
  });

  // Workers can share any TCP connection
  // In this case it is an HTTP server
  server.listen(process.env.PORT || app.get('port'));
  logger.info(`Worker ${process.pid} started`);
}
