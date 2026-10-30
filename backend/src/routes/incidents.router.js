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

router.post("/", async (req, res) => {
  const newIncident = await service.create(req.body);
  res.status(201).json({
    message: "Incidente creado correctamente",
    data: newIncident,
  });
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedIncident = await service.update(id, req.body);
  res.status(200).json({
    message: "Incidente actualizado correctamente",
    data: updatedIncident,
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedIncident = await service.delete(id);
  res.status(200).json({
    message: "Incidente eliminado correctamente",
    data: deletedIncident,
  });
});

module.exports = router;
