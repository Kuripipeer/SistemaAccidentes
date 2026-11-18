"use strict";

const mongoose = require("mongoose");
const { BusStopModel } = require("../models/bus-stop.model");
const AppError = require("../utils/appError");

class BusStopsService {
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

    return BusStopModel.find(query).sort({ createdAt: -1 });
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(404, `No se encontró la parada de transporte con ID ${id}`);
    }

    const busStop = await BusStopModel.findById(id);

    if (!busStop) {
      throw new AppError(404, `No se encontró la parada de transporte con ID ${id}`);
    }

    return busStop;
  }

  async getGeoJSON(filters = {}) {
    const busStops = await this.getAll(filters);

    return {
      type: "FeatureCollection",
      features: busStops.map((busStop) => ({
        type: "Feature",
        properties: {
          id: busStop.id,
          name: busStop.name,
          type: busStop.type,
          status: busStop.status,
          description: busStop.description,
          routesCount: busStop.routesCount,
          createdAt: busStop.createdAt,
          updatedAt: busStop.updatedAt,
        },
        geometry: busStop.location,
      })),
    };
  }

  async create(data) {
    return BusStopModel.create({
      name: data.name.trim(),
      type: data.type.trim(),
      status: data.status.trim(),
      description: data.description.trim(),
      routesCount: Number(data.routesCount),
      location: {
        type: "Point",
        coordinates: [Number(data.longitude), Number(data.latitude)],
      },
    });
  }

  async update(id, changes) {
    const busStop = await this.getById(id);

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
    if (changes.routesCount !== undefined) {
      changes.routesCount = Number(changes.routesCount);
    }

    ["name", "type", "status", "description", "routesCount"].forEach((field) => {
      if (changes[field] !== undefined) {
        busStop[field] = changes[field];
      }
    });

    if (changes.latitude !== undefined || changes.longitude !== undefined) {
      const [currentLongitude, currentLatitude] = busStop.location.coordinates;
      busStop.location.coordinates = [
        changes.longitude !== undefined ? Number(changes.longitude) : currentLongitude,
        changes.latitude !== undefined ? Number(changes.latitude) : currentLatitude,
      ];
    }

    await busStop.save();
    return busStop;
  }

  async delete(id) {
    const busStop = await this.getById(id);
    await busStop.deleteOne();
    return busStop;
  }

  escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

module.exports = BusStopsService;
