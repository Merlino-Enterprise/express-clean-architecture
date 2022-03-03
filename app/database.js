/*
 * Copyright (c) 2021 Merlino Enterprise Sdn. Bhd.
 * All rights reserved.
 */

import mongoose from "mongoose";
import Config from "config";
import {createLogger} from "logger";

// Log module status
const logger = createLogger("database.js");

mongoose.set("debug", (collection, method, query, doc, options) => {
  // Omit agenda jobs
  if (collection === "jobs" || process.env.PROD) return;
  logger.info({dbQuery: {query, doc, options}}, `${collection}.${method}`);
});

const {protocol, user, password, host, port, db, prod} = Config.database;
const CONNECTION_STRING =
  `${protocol}://${user}:${password}@${host}${protocol === "mongodb+srv" ? "" : `:${port}`}` +
  `/${db}?retryWrites=true&w=majority`;

async function initMongo() {
  let config = {
    socketTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    autoIndex: false,
    authSource: "admin"
  };

  // Authenticate if to production shard
  if (prod) {
    config = Object.assign(config, {
      ssl: true
    });
  }

  // Handle connection events
  const {connection} = mongoose;
  connection.on("error", (error) => {
    logger.info(error, "DB Error");
  });
  connection.on("open", () => {
    logger.info(`Connected to DB in process ${process.pid}`);
  });
  connection.on("close", () => {
    logger.info("Disconnected from DB");
  });
  connection.on("disconnected", () => {
    logger.info("Disconnected from DB");
  });

  // Init connection
  return mongoose.connect(CONNECTION_STRING, config);
}

async function closeMongo() {
  return mongoose.disconnect();
}

module.exports = {
  initMongo,
  closeMongo
};
