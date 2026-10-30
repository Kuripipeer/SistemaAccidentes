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

router.post("/", async (req, res) => {
  const newHydrant = await service.create(req.body);
  res.status(201).json({
    message: "Hidrante creado correctamente",
    data: newHydrant,
  });
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedHydrant = await service.update(id, req.body);
  res.status(200).json({
    message: "Hidrante actualizado correctamente",
    data: updatedHydrant,
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedHydrant = await service.delete(id);
  res.status(200).json({
    message: "Hidrante eliminado correctamente",
    data: deletedHydrant,
  });
});

module.exports = router;
