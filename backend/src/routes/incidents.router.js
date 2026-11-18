"use strict";

const express = require("express");
const IncidentsService = require("../services/incidents.service");
const {
  validateIncidentPayload,
  validateIncidentQuery,
} = require("../middlewares/incident.validator");

const router = express.Router();
const service = new IncidentsService();

router.get("/", validateIncidentQuery, async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

router.get("/geojson", validateIncidentQuery, async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      category: req.query.category,
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

    const incident = await service.getById(id);

    res.status(200).json({
      data: incident,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateIncidentPayload({ partial: false }), async (req, res, next) => {
  try {
    const incident = await service.create(req.body);

    res.status(201).json({
      message: "Incidente creado correctamente",
      data: incident,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", validateIncidentPayload({ partial: true }), async (req, res, next) => {
  try {
    const { id } = req.params;

    const incident = await service.update(id, req.body);

    res.status(200).json({
      message: "Incidente actualizado correctamente",
      data: incident,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const incident = await service.delete(id);

    res.status(200).json({
      message: "Incidente eliminado correctamente",
      data: incident,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
