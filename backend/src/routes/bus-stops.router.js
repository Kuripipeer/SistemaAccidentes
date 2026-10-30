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

router.post("/", async (req, res) => {
  const newBusStop = await service.create(req.body);
  res.status(201).json({
    message: "Parada de transporte creada correctamente",
    data: newBusStop,
  });
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedBusStop = await service.update(id, req.body);
  res.status(200).json({
    message: "Parada de transporte actualizada correctamente",
    data: updatedBusStop,
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedBusStop = await service.delete(id);
  res.status(200).json({
    message: "Parada de transporte eliminada correctamente",
    data: deletedBusStop,
  });
});

module.exports = router;
