"use strict";

const express = require("express");
const HydrantsService = require("../services/hydrants.service");

const router = express.Router();
const service = new HydrantsService();

router.get("/", async (req, res) => {
  const filters = {
    search: req.query.search,
    type: req.query.type,
    status: req.query.status,
  };

  const hydrants = await service.getAll(filters);

  res.status(200).json({
    count: hydrants.length,
    data: hydrants,
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

  const hydrant = await service.getById(id);

  res.status(200).json({
    data: hydrant,
  });
});

module.exports = router;
