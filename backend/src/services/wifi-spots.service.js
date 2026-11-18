"use strict";

const mongoose = require("mongoose");
const { WifiSpotModel } = require("../models/wifi-spot.model");
const AppError = require("../utils/appError");

class WifiSpotsService {
  async getAll(filters = {}) {
    const { search = "", type = "all", status = "all" } = filters;

    const query = {};

    if (type !== "all") {
      query.type = type;
    }

    if (status !== "all") {
      query.status = status;
    }

    const text = search ? String(search).trim() : "";

    if (text) {
      const regex = new RegExp(this.escapeRegex(text), "i");
      query.$or = [
        { name: regex },
        { description: regex },
        { type: regex },
      ];
    }

    return WifiSpotModel.find(query).sort({ createdAt: -1 });
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(404, `No se encontró la zona WiFi con ID ${id}`);
    }

    const wifiSpot = await WifiSpotModel.findById(id);

    if (!wifiSpot) {
      throw new AppError(404, `No se encontró la zona WiFi con ID ${id}`);
    }

    return wifiSpot;
  }

  async getGeoJSON(filters = {}) {
    const wifiSpots = await this.getAll(filters);

    return {
      type: "FeatureCollection",
      features: wifiSpots.map((wifiSpot) => ({
        type: "Feature",
        properties: {
          id: wifiSpot.id,
          name: wifiSpot.name,
          type: wifiSpot.type,
          status: wifiSpot.status,
          description: wifiSpot.description,
          speedMbps: wifiSpot.speedMbps,
          createdAt: wifiSpot.createdAt,
          updatedAt: wifiSpot.updatedAt,
        },
        geometry: wifiSpot.location,
      })),
    };
  }

  async create(data) {
    return WifiSpotModel.create({
      name: data.name.trim(),
      type: data.type.trim(),
      status: data.status.trim(),
      description: data.description.trim(),
      speedMbps: Number(data.speedMbps),
      location: {
        type: "Point",
        coordinates: [Number(data.longitude), Number(data.latitude)],
      },
    });
  }

  async update(id, changes) {
    const wifiSpot = await this.getById(id);

    if (changes.name !== undefined) {
      changes.name = changes.name.trim();
    }
    if (changes.type !== undefined) {
      changes.type = changes.type.trim();
    }
    if (changes.status !== undefined) {
      changes.status = changes.status.trim();
    }
    if (changes.description !== undefined) {
      changes.description = changes.description.trim();
    }
    if (changes.speedMbps !== undefined) {
      changes.speedMbps = Number(changes.speedMbps);
    }

    ["name", "type", "status", "description", "speedMbps"].forEach((field) => {
      if (changes[field] !== undefined) {
        wifiSpot[field] = changes[field];
      }
    });

    if (changes.latitude !== undefined || changes.longitude !== undefined) {
      const [currentLongitude, currentLatitude] = wifiSpot.location.coordinates;
      wifiSpot.location.coordinates = [
        changes.longitude !== undefined ? Number(changes.longitude) : currentLongitude,
        changes.latitude !== undefined ? Number(changes.latitude) : currentLatitude,
      ];
    }

    await wifiSpot.save();
    return wifiSpot;
  }

  async delete(id) {
    const wifiSpot = await this.getById(id);
    await wifiSpot.deleteOne();
    return wifiSpot;
  }

  escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

module.exports = WifiSpotsService;
