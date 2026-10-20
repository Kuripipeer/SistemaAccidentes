"use strict";

const express = require("express");
const IncidentsService = require("../services/incidents.service");

const router = express.Router();
const service = new IncidentsService();

router.get("/", async (req, res) => {
  const filters = {
    search: req.query.search,
    category: req.query.category,
    status: req.query.status,
  };
  const incidents = await service.getAll(filters);
  res.status(200).json({
    count: incidents.length,
    data: incidents,
  });
});

router.get("/geojson", async (req, res) => {
  const filters = {
    search: req.query.search,
    category: req.query.category,
    status: req.query.status,
  };
  const geoJSON = await service.getGeoJSON(filters);
  res.status(200).json(geoJSON);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const incident = await service.getById(id);

  res.status(200).json({
    data: incident,
  });
});

module.exports = router;
