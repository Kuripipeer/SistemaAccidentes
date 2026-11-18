"use strict";

const mongoose = require("mongoose");

const IncidentModel = require("../models/incident.model");
const AppError = require("../utils/appError");

class IncidentsService {
  async getAll(filters = {}) {
    const {
      search = "",
      category = "all",
      status = "all",
    } = filters;

    const query = {};

    if (category !== "all") {
      query.category = category;
    }

    if (status !== "all") {
      query.status = status;
    }

    const text = search ? String(search).trim() : "";

    if (text) {
      const regex = new RegExp(this.escapeRegex(text), "i");

      query.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
      ];
    }

    return IncidentModel.find(query).sort({ createdAt: -1 });
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(404, `No se encontró el incidente con ID ${id}`);
    }

    const incident = await IncidentModel.findById(id);

    if (!incident) {
      throw new AppError(404, `No se encontró el incidente con ID ${id}`);
    }

    return incident;
  }

  async getGeoJSON(filters = {}) {
    const incidents = await this.getAll(filters);

    return {
      type: "FeatureCollection",
      features: incidents.map((incident) => ({
        type: "Feature",
        properties: {
          id: incident.id,
          title: incident.title,
          category: incident.category,
          description: incident.description,
          status: incident.status,
          createdAt: incident.createdAt,
          updatedAt: incident.updatedAt,
        },
        geometry: incident.location,
      })),
    };
  }

  async create(data) {
    return IncidentModel.create({
      title: data.title.trim(),
      category: data.category.trim(),
      description: data.description.trim(),
      status: data.status.trim(),
      location: {
        type: "Point",
        coordinates: [
          Number(data.longitude),
          Number(data.latitude),
        ],
      },
    });
  }

  async update(id, changes) {
    const incident = await this.getById(id);

    if (changes.title !== undefined) {
      changes.title = changes.title.trim();
    }

    if (changes.category !== undefined) {
      changes.category = changes.category.trim();
    }

    if (changes.description !== undefined) {
      changes.description = changes.description.trim();
    }

    if (changes.status !== undefined) {
      changes.status = changes.status.trim();
    }

    ["title", "category", "description", "status"].forEach((field) => {
      if (changes[field] !== undefined) {
        incident[field] = changes[field];
      }
    });

    if (changes.latitude !== undefined || changes.longitude !== undefined) {
      const [currentLongitude, currentLatitude] = incident.location.coordinates;

      incident.location.coordinates = [
        changes.longitude !== undefined ? Number(changes.longitude) : currentLongitude,
        changes.latitude !== undefined ? Number(changes.latitude) : currentLatitude,
      ];
    }

    await incident.save();

    return incident;
  }

  async delete(id) {
    const incident = await this.getById(id);

    await incident.deleteOne();

    return incident;
  }

  escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

module.exports = IncidentsService;