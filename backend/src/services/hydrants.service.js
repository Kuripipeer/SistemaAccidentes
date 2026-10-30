"use strict";

const { randomUUID } = require("node:crypto");

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

  async create(data) {
    const newHydrant = {
      id: `HYD-${randomUUID()}`,
      name: data.name.trim(),
      type: data.type,
      status: data.status || "funcional",
      description: data.description.trim(),
      pressurePsi: Number(data.pressurePsi),
      location: {
        type: "Point",
        coordinates: [Number(data.longitude), Number(data.latitude)],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.hydrants.push(newHydrant);
    return newHydrant;
  }

  async update(id, changes) {
    const index = this.hydrants.findIndex((hydrant) => hydrant.id === id);
    if (index === -1) {
      throw new AppError(
        404,
        `Hidrante no encontrado/inexistente con el id: ${id}`,
      );
    }
    const currentHydrant = this.hydrants[index];
    const currentLongitude = currentHydrant.location.coordinates[0];
    const currentLatitude = currentHydrant.location.coordinates[1];

    const updatedLongitude =
      changes.longitude !== undefined
        ? Number(changes.longitude)
        : currentLongitude;

    const updatedLatitude =
      changes.latitude !== undefined
        ? Number(changes.latitude)
        : currentLatitude;

    const updatedHydrant = {
      ...currentHydrant,
      ...(changes.name !== undefined && { name: changes.name.trim() }),
      ...(changes.type !== undefined && { type: changes.type }),
      ...(changes.status !== undefined && { status: changes.status }),
      ...(changes.description !== undefined && {
        description: changes.description.trim(),
      }),
      ...(changes.pressurePsi !== undefined && {
        pressurePsi: Number(changes.pressurePsi),
      }),
      location: {
        type: "Point",
        coordinates: [updatedLongitude, updatedLatitude],
      },
      updatedAt: new Date().toISOString(),
    };

    this.hydrants[index] = updatedHydrant;
    return updatedHydrant;
  }

  async delete(id) {
    const index = this.hydrants.findIndex((hydrant) => hydrant.id === id);
    if (index === -1) {
      throw new AppError(
        404,
        `Hidrante no encontrado/inexistente con el id: ${id}`,
      );
    }
    const deletedHydrant = this.hydrants.splice(index, 1)[0];
    return deletedHydrant;
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
