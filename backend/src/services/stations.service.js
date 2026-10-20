"use strict";

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
