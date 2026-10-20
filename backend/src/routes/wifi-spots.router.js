"use strict";

const express = require("express");
const WifiSpotsService = require("../services/wifi-spots.service");

const router = express.Router();
const service = new WifiSpotsService();

router.get("/", async (req, res) => {
  const filters = {
    search: req.query.search,
    type: req.query.type,
    status: req.query.status,
  };
  const wifiSpots = await service.getAll(filters);
  res.status(200).json({
    count: wifiSpots.length,
    data: wifiSpots,
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
  const wifiSpot = await service.getById(id);
  res.status(200).json({
    data: wifiSpot,
  });
});

module.exports = router;
