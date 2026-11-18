"use strict";

const express = require("express");
const StationsService = require("../services/stations.service");
const {
  validateStationPayload,
  validateStationQuery,
} = require("../middlewares/stations.validator");

const router = express.Router();
const service = new StationsService();

router.get("/", validateStationQuery, async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

router.get("/geojson", validateStationQuery, async (req, res, next) => {
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
    const station = await service.getById(id);
    res.status(200).json({
      data: station,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateStationPayload({ partial: false }), async (req, res, next) => {
  try {
    const newStation = await service.create(req.body);
    res.status(201).json({
      message: "Estación de emergencia creada correctamente",
      data: newStation,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", validateStationPayload({ partial: true }), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedStation = await service.update(id, req.body);
    res.status(200).json({
      message: "Estación de emergencia actualizada correctamente",
      data: updatedStation,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedStation = await service.delete(id);
    res.status(200).json({
      message: "Estación de emergencia eliminada correctamente",
      data: deletedStation,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
