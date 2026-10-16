"use strict";

const express = require("express");
const StationsService = require("../services/stations.service");

const router = express.Router();
const service = new StationsService();

router.get("/", async (req, res) => {
  const filters = {
    search: req.query.search,
    type: req.query.type,
    status: req.query.status,
  };

  const stations = await service.getAll(filters);

  res.status(200).json({
    count: stations.length,
    data: stations,
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

  const station = await service.getById(id);

  res.status(200).json({
    data: station,
  });
});

module.exports = router;
