/*
 * Copyright (c) 2021 Merlino Enterprise Sdn. Bhd.
 * All rights reserved.
 */

import express from "express";
import path from "path";
import exphbs from "express-handlebars";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import responseTime from "response-time";
import basicAuth from "express-basic-auth";
import Agendash from "agendash";

import Config from "config";
// import {initMongo, closeMongo} from "database";
import handlebarsDateformat from "handlebars-dateformat";

import {notFound, logError, logRequest, correlate} from "logger";
import agenda from "./agenda";

const faker = require("faker");

// Initialize express server
const app = express();

// Initialize connection to the database
// initMongo();

// Handlebars
const hbs = exphbs.create({helpers: {}});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
hbs.handlebars.registerHelper("dateFormat", handlebarsDateformat);

app.set("port", Config.server.port);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(responseTime());
app.use(express.static(path.join(__dirname, "public")));

app.use(correlate);
app.use(logRequest);

app.use("/favicon.ico", express.static("favicon.ico"));

app.use(
  "/dash",
  basicAuth({
    challenge: true
  }),
  Agendash(agenda)
);

app.get("/", async (req, res) => {
  res.json({
    success: true,
    data: {
      version: 1,
      description: "Express Clean Architecture API"
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render("error");
});

// Add a health check route
app.get("/_health", (req, res) => {
  res.status(200).send("ok");
});

// Handle errors
app.use(notFound);
app.use(logError);

const gracefulExit = () => {
  // Promise.all([closeMongo()]).then(() => {
  //   process.exit(0);
  // });
};

process.on("exit", () => gracefulExit());

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);

export default app;
