"use strict";

const mongoose = require("mongoose");
const { StationModel } = require("../models/station.model");
const AppError = require("../utils/appError");

class StationsService {
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

    return StationModel.find(query).sort({ createdAt: -1 });
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(404, `No se encontró la estación de emergencia con ID ${id}`);
    }

    const station = await StationModel.findById(id);

    if (!station) {
      throw new AppError(404, `No se encontró la estación de emergencia con ID ${id}`);
    }

    return station;
  }

  async getGeoJSON(filters = {}) {
    const stations = await this.getAll(filters);

    return {
      type: "FeatureCollection",
      features: stations.map((station) => ({
        type: "Feature",
        properties: {
          id: station.id,
          name: station.name,
          type: station.type,
          status: station.status,
          description: station.description,
          units: station.units,
          createdAt: station.createdAt,
          updatedAt: station.updatedAt,
        },
        geometry: station.location,
      })),
    };
  }

  async create(data) {
    return StationModel.create({
      name: data.name.trim(),
      type: data.type.trim(),
      status: data.status.trim(),
      description: data.description.trim(),
      units: Number(data.units),
      location: {
        type: "Point",
        coordinates: [Number(data.longitude), Number(data.latitude)],
      },
    });
  }

  async update(id, changes) {
    const station = await this.getById(id);

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
    if (changes.units !== undefined) {
      changes.units = Number(changes.units);
    }

    ["name", "type", "status", "description", "units"].forEach((field) => {
      if (changes[field] !== undefined) {
        station[field] = changes[field];
      }
    });

    if (changes.latitude !== undefined || changes.longitude !== undefined) {
      const [currentLongitude, currentLatitude] = station.location.coordinates;
      station.location.coordinates = [
        changes.longitude !== undefined ? Number(changes.longitude) : currentLongitude,
        changes.latitude !== undefined ? Number(changes.latitude) : currentLatitude,
      ];
    }

    await station.save();
    return station;
  }

  async delete(id) {
    const station = await this.getById(id);
    await station.deleteOne();
    return station;
  }

  escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

module.exports = StationsService;
