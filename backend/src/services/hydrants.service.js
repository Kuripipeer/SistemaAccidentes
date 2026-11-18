"use strict";

const mongoose = require("mongoose");
const { HydrantModel } = require("../models/hydrant.model");
const AppError = require("../utils/appError");

class HydrantsService {
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

    return HydrantModel.find(query).sort({ createdAt: -1 });
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(404, `No se encontró el hidrante con ID ${id}`);
    }

    const hydrant = await HydrantModel.findById(id);

    if (!hydrant) {
      throw new AppError(404, `No se encontró el hidrante con ID ${id}`);
    }

    return hydrant;
  }

  async getGeoJSON(filters = {}) {
    const hydrants = await this.getAll(filters);

    return {
      type: "FeatureCollection",
      features: hydrants.map((hydrant) => ({
        type: "Feature",
        properties: {
          id: hydrant.id,
          name: hydrant.name,
          type: hydrant.type,
          status: hydrant.status,
          description: hydrant.description,
          pressurePsi: hydrant.pressurePsi,
          createdAt: hydrant.createdAt,
          updatedAt: hydrant.updatedAt,
        },
        geometry: hydrant.location,
      })),
    };
  }

  async create(data) {
    return HydrantModel.create({
      name: data.name.trim(),
      type: data.type.trim(),
      status: data.status.trim(),
      description: data.description.trim(),
      pressurePsi: Number(data.pressurePsi),
      location: {
        type: "Point",
        coordinates: [Number(data.longitude), Number(data.latitude)],
      },
    });
  }

  async update(id, changes) {
    const hydrant = await this.getById(id);

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
    if (changes.pressurePsi !== undefined) {
      changes.pressurePsi = Number(changes.pressurePsi);
    }

    ["name", "type", "status", "description", "pressurePsi"].forEach((field) => {
      if (changes[field] !== undefined) {
        hydrant[field] = changes[field];
      }
    });

    if (changes.latitude !== undefined || changes.longitude !== undefined) {
      const [currentLongitude, currentLatitude] = hydrant.location.coordinates;
      hydrant.location.coordinates = [
        changes.longitude !== undefined ? Number(changes.longitude) : currentLongitude,
        changes.latitude !== undefined ? Number(changes.latitude) : currentLatitude,
      ];
    }

    await hydrant.save();
    return hydrant;
  }

  async delete(id) {
    const hydrant = await this.getById(id);
    await hydrant.deleteOne();
    return hydrant;
  }

  escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

module.exports = HydrantsService;
