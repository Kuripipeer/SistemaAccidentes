"use strict";

const express = require("express");
const WifiSpotsService = require("../services/wifi-spots.service");
const {
  validateWifiSpotPayload,
  validateWifiSpotQuery,
} = require("../middlewares/wifi-spots.validator");

const router = express.Router();
const service = new WifiSpotsService();

router.get("/", validateWifiSpotQuery, async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

router.get("/geojson", validateWifiSpotQuery, async (req, res, next) => {
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
    const wifiSpot = await service.getById(id);
    res.status(200).json({
      data: wifiSpot,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateWifiSpotPayload({ partial: false }), async (req, res, next) => {
  try {
    const newWifiSpot = await service.create(req.body);
    res.status(201).json({
      message: "Zona WiFi creada correctamente",
      data: newWifiSpot,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", validateWifiSpotPayload({ partial: true }), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedWifiSpot = await service.update(id, req.body);
    res.status(200).json({
      message: "Zona WiFi actualizada correctamente",
      data: updatedWifiSpot,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedWifiSpot = await service.delete(id);
    res.status(200).json({
      message: "Zona WiFi eliminada correctamente",
      data: deletedWifiSpot,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
