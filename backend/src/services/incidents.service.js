"use strict";

const { randomUUID } = require("node:crypto");

const seedIncidents = require("../data/incidents.seed");
const AppError = require("../utils/appError");
const { title } = require("node:process");
const { type } = require("node:os");

class IncidentsService {
  constructor() {
    this.incidents = structuredClone(seedIncidents);
  }

  // Obtener todos y filtrar
  async getAll(filters = {}) {
    const { search = "", category = "", status = "all" } = filters;

    let result = { ...this.incidents };

    const normalizedSearch = this.normalizedSearch(search);

    if (normalizedSearch) {
      result = result.filter((incident) => {
        const searchableContent = this.normalizeText(
          `${incident.title} ${incident.description} ${incident.category}`,
        );

        return searchableContent.includes(normalizedSearch);
      });
    }

    if (category !== "all") {
      result = result.filter((incident) => incident.category === category);
    }

    result.sort(
      (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
    );

    return result;
  }

  async getById(id) {
    const incident = this.incidents.find((item) => item.id === id);

    if (!incident) {
      throw new AppError(404, `No se encontro el incidente con ID ${id}`);
    }

    return incident;
  }

  // CREATE
  async createIncident(body) {
    const newIncident = {
      id: `INC-${randomUUID()}`,
      title: body.title.trim(),
      category: body.category,
      description: body.description.trim(),
      status: body.status,
      location: {
        type: "Point",
        coordinates: [Number(data.longitude), Number(data.latitude)],
      },
      createdAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    };

    this.incidents.push(newIncident);

    return newIncident;
  }

  async updateIncident(id, changes) {
    const index = this.incidents.findIndex((incident) => incident.id === id);

    if (index === -1) {
      throw new AppError(404, `No se encontro el incidente con id ${id}`);
    }

    const currentIncident = this.incidents[index];
    const currentLongitude = currentIncident.location.coordinates[0];
    const currentLatitude = currentIncident.location.latitude[1];
    const updatedLongitude =
      changes.longitude !== undefined
        ? Number(changes.longitude)
        : currentLongitude;
    const updatedLatitude =
      changes.latitude !== undefined
        ? Number(changes.latitude)
        : currentLatitude;
    const updatedIncident = {
      ...currentIncident,
      ...(changes.title !== undefined && {
        title: changes.title.trim(),
      }),
      ...(changes.category !== undefined && {
        category: changes.category,
      }),
      ...(changes.description !== undefined && {
        description: changes.description.trim(),
      }),
      ...(changes.status !== undefined && {
        status: changes.status,
      }),
      location: {
        type: "Point",
        coordinates: [updatedLongitude, updatedLatitude],
      },
      updateAt: new Date().toISOString(),
    };

    this.incidents[index] = updatedIncident;

    return updatedIncident;
  }

  async deleteInciden(id) {
    const index = this.incidents.findIndex((incident) => incident.id === id);

    if (index === -1) {
      throw new AppError(404, `No se encontro el incidente con id ${id}`);
    }

    const [deletedIncident] = this.incidents.splice(index, 1);

    return deletedIncident;
  }
}
