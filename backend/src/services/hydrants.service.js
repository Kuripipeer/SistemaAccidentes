"use strict";

const seedHydrants = require("../data/hydrants.seed");
const AppError = require("../utils/appError");

class HydrantsService {
  constructor() {
    this.hydrants = structuredClone(seedHydrants);
  }

  // Obtener todos y filtrar

  async getAll(filters = {}) {
    const { search = "", type = "all", status = "all" } = filters;
    let result = [...this.hydrants];
    const normalizedSearch = this.normalizeText(search);
    if (normalizedSearch) {
      result = result.filter((hydrant) => {
        const searchableContent = this.normalizeText(
          `${hydrant.name} ${hydrant.description} ${hydrant.type}`,
        );
        return searchableContent.includes(normalizedSearch);
      });
    }
    if (type !== "all") {
      result = result.filter((hydrant) => hydrant.type === type);
    }
    if (status !== "all") {
      result = result.filter((hydrant) => hydrant.status === status);
    }
    // Los más recientes aparecen primero
    result.sort(
      (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
    );
    return result;
  }

  async getById(id) {
    const hydrant = this.hydrants.find((hydrant) => hydrant.id === id);
    if (!hydrant) {
      throw new AppError(404, "Hidrante no encontrado/inexistente");
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

  normalizeText(value) {
    return String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }
}

module.exports = HydrantsService;
