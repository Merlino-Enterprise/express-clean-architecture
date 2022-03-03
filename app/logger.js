/*
 * Copyright (c) 2021 Merlino Enterprise Sdn. Bhd.
 * All rights reserved.
 */

import Bunyan from 'bunyan';
import {v4 as uuid} from 'uuid';
import jwt from 'jsonwebtoken';
import {promisify} from 'util';
import Config from 'config';

/**
 * Initialize Bunyan.
 * @param name Name of the logger
 * @returns {Logger}
 */
const createLogger = (name) => Bunyan.createLogger({
  name,
  serializers: {
    err: Bunyan.stdSerializers.err,
    req: ({method, url, connection}) => ({
      method,
      url,
      remoteAddress: connection.remoteAddress,
      remotePort: connection.remotePort
    }),
    res: ({statusCode}) => ({statusCode}),
    user: ({_id, username}) => ({_id, username})
  }
});

/**
 * Handle requests to non existing endpoints.
 * @param req
 * @param res
 */
const notFound = (req, res) => {
  req.logger.error({req}, 'Endpoint not found');
  res.status(404).json({
    success: false,
    error: {description: 'Endpoint not found'}
  });
};

/**
 * Add correlation ID to all requests.
 * @param req
 * @param res
 * @param next
 */
const correlate = (req, res, next) => {
  req.correlationId = uuid();
  next();
};

/**
 * Log when every requests finishes.
 * @param req
 * @param res
 */
const logResponse = (req, res) => {
  res.on('finish', () => {
    if (req.url === '/') return;
    req.logger.info({req, res}, 'Response sent');
  });
};

/**
 * Log every request.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const logRequest = async (req, res, next) => {
  req.logger = createLogger('request');
  req.logger = req.logger.child({correlationId: req.correlationId || ''});

  if (req.url === '/') return next();

  let user;
  const token = req.headers['x-access-token'];
  if (token) {
    try {
      user = await promisify(jwt.verify)(token, Config.jwt.secret);
    } catch (e) {
      req.logger.error(e);
    }
  }
  req.logger.info({req, user}, 'Request received');
  logResponse(req, res);

  return next();
};

/**
 * Log every error.
 * @param err
 * @param req
 * @param res
 * @param next
 */
const logError = (err, req, res, next) => {
  req.logger.error({
    err,
    httpStatusCode: err.httpStatusCode
  });

  if (req.xhr) {
    res.status(500).send({success: false, error: {error: err}});
  } else next(err);
};

export {
  createLogger,
  notFound,
  logRequest,
  logError,
  correlate
};
