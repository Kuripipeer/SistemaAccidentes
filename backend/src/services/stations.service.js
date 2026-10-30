"use strict";

const { randomUUID } = require("node:crypto");

const seedStations = require("../data/stations.seed");
const AppError = require("../utils/appError");

class StationsService {
  constructor() {
    this.stations = structuredClone(seedStations);
  }
  // Obtener todos y filtrar
  async getAll(filters = {}) {
    const { search = "", type = "all", status = "all" } = filters;
    let result = [...this.stations];
    const normalizedSearch = this.normalizeText(search);
    if (normalizedSearch) {
      result = result.filter((station) => {
        const searchableContent = this.normalizeText(
          `${station.name} ${station.description} ${station.type}`,
        );
        return searchableContent.includes(normalizedSearch);
      });
    }
    if (type !== "all") {
      result = result.filter((station) => station.type === type);
    }
    if (status !== "all") {
      result = result.filter((station) => station.status === status);
    }
    // Los más recientes aparecen primero
    result.sort(
      (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
    );
    return result;
  }

  async getById(id) {
    const station = this.stations.find((station) => station.id === id);
    if (!station) {
      throw new AppError(404, "Estación de emergencia no encontrada/inexistente");
    }
    return station;
  }

  async create(data) {
    const newStation = {
      id: `STA-${randomUUID()}`,
      name: data.name.trim(),
      type: data.type,
      status: data.status || "activa",
      description: data.description.trim(),
      units: Number(data.units),
      location: {
        type: "Point",
        coordinates: [Number(data.longitude), Number(data.latitude)],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.stations.push(newStation);
    return newStation;
  }

  async update(id, changes) {
    const index = this.stations.findIndex((station) => station.id === id);
    if (index === -1) {
      throw new AppError(
        404,
        `Estación de emergencia no encontrada/inexistente con el id: ${id}`,
      );
    }
    const currentStation = this.stations[index];
    const currentLongitude = currentStation.location.coordinates[0];
    const currentLatitude = currentStation.location.coordinates[1];

    const updatedLongitude =
      changes.longitude !== undefined
        ? Number(changes.longitude)
        : currentLongitude;

    const updatedLatitude =
      changes.latitude !== undefined
        ? Number(changes.latitude)
        : currentLatitude;

    const updatedStation = {
      ...currentStation,
      ...(changes.name !== undefined && { name: changes.name.trim() }),
      ...(changes.type !== undefined && { type: changes.type }),
      ...(changes.status !== undefined && { status: changes.status }),
      ...(changes.description !== undefined && {
        description: changes.description.trim(),
      }),
      ...(changes.units !== undefined && {
        units: Number(changes.units),
      }),
      location: {
        type: "Point",
        coordinates: [updatedLongitude, updatedLatitude],
      },
      updatedAt: new Date().toISOString(),
    };

    this.stations[index] = updatedStation;
    return updatedStation;
  }

  async delete(id) {
    const index = this.stations.findIndex((station) => station.id === id);
    if (index === -1) {
      throw new AppError(
        404,
        `Estación de emergencia no encontrada/inexistente con el id: ${id}`,
      );
    }
    const deletedStation = this.stations.splice(index, 1)[0];
    return deletedStation;
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

  normalizeText(value) {
    return String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }
}

module.exports = StationsService;
