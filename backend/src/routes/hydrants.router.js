"use strict";

const express = require("express");
const HydrantsService = require("../services/hydrants.service");
const {
  validateHydrantPayload,
  validateHydrantQuery,
} = require("../middlewares/hydrants.validator");

const router = express.Router();
const service = new HydrantsService();

router.get("/", validateHydrantQuery, async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

router.get("/geojson", validateHydrantQuery, async (req, res, next) => {
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
    const hydrant = await service.getById(id);
    res.status(200).json({
      data: hydrant,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateHydrantPayload({ partial: false }), async (req, res, next) => {
  try {
    const newHydrant = await service.create(req.body);
    res.status(201).json({
      message: "Hidrante creado correctamente",
      data: newHydrant,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", validateHydrantPayload({ partial: true }), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedHydrant = await service.update(id, req.body);
    res.status(200).json({
      message: "Hidrante actualizado correctamente",
      data: updatedHydrant,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedHydrant = await service.delete(id);
    res.status(200).json({
      message: "Hidrante eliminado correctamente",
      data: deletedHydrant,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
