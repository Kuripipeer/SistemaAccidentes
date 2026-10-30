"use strict";

const { randomUUID } = require("node:crypto");

const seedBusStops = require("../data/bus-stops.seed");
const AppError = require("../utils/appError");

class BusStopsService {
  constructor() {
    this.busStops = structuredClone(seedBusStops);
  }

  // Obtener todos y filtrar

  async getAll(filters = {}) {
    const { search = "", type = "all", status = "all" } = filters
    let result = [...this.busStops];
    const normalizedSearch = this.normalizeText(search);
    if (normalizedSearch) {
      result = result.filter((busStop) => {
        const searchableContent = this.normalizeText(
          `${busStop.name} ${busStop.description} ${busStop.type}`,
        );
        return searchableContent.includes(normalizedSearch);
      });
    }
    if (type !== "all") {
      result = result.filter((busStop) => busStop.type === type);
    }
    if (status !== "all") {
      result = result.filter((busStop) => busStop.status === status);
    }
    // Los más recientes aparecen primero
    result.sort(
      (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
    );
    return result;
  }

  async getById(id) {
    const busStop = this.busStops.find((busStop) => busStop.id === id);
    if (!busStop) {
      throw new AppError(404, "Parada de transporte no encontrada/inexistente");
    }
    return busStop;
  }

  async create(data) {
    const newBusStop = {
      id: `BUS-${randomUUID()}`,
      name: data.name.trim(),
      type: data.type,
      status: data.status || "operando",
      description: data.description.trim(),
      routesCount: Number(data.routesCount),
      location: {
        type: "Point",
        coordinates: [Number(data.longitude), Number(data.latitude)],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.busStops.push(newBusStop);
    return newBusStop;
  }

  async update(id, changes) {
    const index = this.busStops.findIndex((busStop) => busStop.id === id);
    if (index === -1) {
      throw new AppError(
        404,
        `Parada de transporte no encontrada/inexistente con el id: ${id}`,
      );
    }
    const currentBusStop = this.busStops[index];
    const currentLongitude = currentBusStop.location.coordinates[0];
    const currentLatitude = currentBusStop.location.coordinates[1];

    const updatedLongitude =
      changes.longitude !== undefined
        ? Number(changes.longitude)
        : currentLongitude;

    const updatedLatitude =
      changes.latitude !== undefined
        ? Number(changes.latitude)
        : currentLatitude;

    const updatedBusStop = {
      ...currentBusStop,
      ...(changes.name !== undefined && { name: changes.name.trim() }),
      ...(changes.type !== undefined && { type: changes.type }),
      ...(changes.status !== undefined && { status: changes.status }),
      ...(changes.description !== undefined && {
        description: changes.description.trim(),
      }),
      ...(changes.routesCount !== undefined && {
        routesCount: Number(changes.routesCount),
      }),
      location: {
        type: "Point",
        coordinates: [updatedLongitude, updatedLatitude],
      },
      updatedAt: new Date().toISOString(),
    };

    this.busStops[index] = updatedBusStop;
    return updatedBusStop;
  }

  async delete(id) {
    const index = this.busStops.findIndex((busStop) => busStop.id === id);
    if (index === -1) {
      throw new AppError(
        404,
        `Parada de transporte no encontrada/inexistente con el id: ${id}`,
      );
    }
    const deletedBusStop = this.busStops.splice(index, 1)[0];
    return deletedBusStop;
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

  normalizeText(value) {
    return String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }
}

module.exports = BusStopsService;
