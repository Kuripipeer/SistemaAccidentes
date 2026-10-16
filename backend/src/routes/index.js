"use strict";

const express = require("express");
const incidentsRouter = require("./incidents.router");
const busStopsRouter = require("./bus-stops.router");
const hydrantsRouter = require("./hydrants.router");
const stationsRouter = require("./stations.router");
const wifiSpotsRouter = require("./wifi-spots.router");

function routerApi(app) {
  const apiRouter = express.Router();

  app.use("/api", apiRouter);
  apiRouter.use("/incidents", incidentsRouter);
  apiRouter.use("/bus-stops", busStopsRouter);
  apiRouter.use("/hydrants", hydrantsRouter);
  apiRouter.use("/stations", stationsRouter);
  apiRouter.use("/wifi-spots", wifiSpotsRouter);
}

module.exports = routerApi;
