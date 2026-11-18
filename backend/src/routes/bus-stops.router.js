"use strict";

const express = require("express");
const BusStopsService = require("../services/bus-stops.service");
const {
  validateBusStopPayload,
  validateBusStopQuery,
} = require("../middlewares/bus-stops.validator");

const router = express.Router();
const service = new BusStopsService();

router.get("/", validateBusStopQuery, async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

router.get("/geojson", validateBusStopQuery, async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      type: req.query.type,
      status: req.query.status,
    };
    const geoJSON = await service.getGeoJSON(filters);
    res.status(200).json(geoJSON);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const busStop = await service.getById(id);
    res.status(200).json({
      data: busStop,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateBusStopPayload({ partial: false }), async (req, res, next) => {
  try {
    const newBusStop = await service.create(req.body);
    res.status(201).json({
      message: "Parada de transporte creada correctamente",
      data: newBusStop,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", validateBusStopPayload({ partial: true }), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBusStop = await service.update(id, req.body);
    res.status(200).json({
      message: "Parada de transporte actualizada correctamente",
      data: updatedBusStop,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBusStop = await service.delete(id);
    res.status(200).json({
      message: "Parada de transporte eliminada correctamente",
      data: deletedBusStop,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
