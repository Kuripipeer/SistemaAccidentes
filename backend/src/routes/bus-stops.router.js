"use strict";

const express = require("express");
const BusStopsService = require("../services/bus-stops.service");

const router = express.Router();
const service = new BusStopsService();

router.get("/", async (req, res) => {
  const filters = {
    search: req.query.search,
    type: req.query.type,
    status: req.query.status,
  };
  const busStops = await service.getAll(filters);
  res.status(200).json({
    count: busStops.length,
    data: busStops,
  });
});

router.get("/geojson", async (req, res) => {
  const filters = {
    search: req.query.search,
    type: req.query.type,
    status: req.query.status,
  };

  const geoJSON = await service.getGeoJSON(filters);

  res.status(200).json(geoJSON);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const busStop = await service.getById(id);

  res.status(200).json({
    data: busStop,
  });
});

module.exports = router;
