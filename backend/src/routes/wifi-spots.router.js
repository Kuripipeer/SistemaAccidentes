"use strict";

const express = require("express");
const WifiSpotsService = require("../services/wifi-spots.service");

const router = express.Router();
const service = new WifiSpotsService();

router.get("/", async (req, res) => {
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
  const wifiSpot = await service.getById(id);
  res.status(200).json({
    data: wifiSpot,
  });
});

router.post("/", async (req, res) => {
  const newWifiSpot = await service.create(req.body);
  res.status(201).json({
    message: "Zona WiFi creada correctamente",
    data: newWifiSpot,
  });
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedWifiSpot = await service.update(id, req.body);
  res.status(200).json({
    message: "Zona WiFi actualizada correctamente",
    data: updatedWifiSpot,
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedWifiSpot = await service.delete(id);
  res.status(200).json({
    message: "Zona WiFi eliminada correctamente",
    data: deletedWifiSpot,
  });
});

module.exports = router;
