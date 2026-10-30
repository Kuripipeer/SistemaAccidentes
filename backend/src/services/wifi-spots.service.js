"use strict";

const { randomUUID } = require("node:crypto");

const seedWifiSpots = require("../data/wifi-spots.seed");
const AppError = require("../utils/appError");

class WifiSpotsService {
  constructor() {
    this.wifiSpots = structuredClone(seedWifiSpots);
  }
  // Obtener todos y filtrar
  async getAll(filters = {}) {
    const { search = "", type = "all", status = "all" } = filters;
    let result = [...this.wifiSpots];
    const normalizedSearch = this.normalizeText(search);
    if (normalizedSearch) {
      result = result.filter((wifiSpot) => {
        const searchableContent = this.normalizeText(
          `${wifiSpot.name} ${wifiSpot.description} ${wifiSpot.type}`,
        );
        return searchableContent.includes(normalizedSearch);
      });
    }
    if (type !== "all") {
      result = result.filter((wifiSpot) => wifiSpot.type === type);
    }
    if (status !== "all") {
      result = result.filter((wifiSpot) => wifiSpot.status === status);
    }
    // Los más recientes aparecen primero
    result.sort(
      (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
    );
    return result;
  }

  async getById(id) {
    const wifiSpot = this.wifiSpots.find((wifiSpot) => wifiSpot.id === id);
    if (!wifiSpot) {
      throw new AppError(404, "Zona WiFi no encontrada/inexistente");
    }
    return wifiSpot;
  }

  async create(data) {
    const newWifiSpot = {
      id: `WIFI-${randomUUID()}`,
      name: data.name.trim(),
      type: data.type,
      status: data.status || "activa",
      description: data.description.trim(),
      speedMbps: Number(data.speedMbps),
      location: {
        type: "Point",
        coordinates: [Number(data.longitude), Number(data.latitude)],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.wifiSpots.push(newWifiSpot);
    return newWifiSpot;
  }

  async update(id, changes) {
    const index = this.wifiSpots.findIndex((wifiSpot) => wifiSpot.id === id);
    if (index === -1) {
      throw new AppError(
        404,
        `Zona WiFi no encontrada/inexistente con el id: ${id}`,
      );
    }
    const currentWifiSpot = this.wifiSpots[index];
    const currentLongitude = currentWifiSpot.location.coordinates[0];
    const currentLatitude = currentWifiSpot.location.coordinates[1];

    const updatedLongitude =
      changes.longitude !== undefined
        ? Number(changes.longitude)
        : currentLongitude;

    const updatedLatitude =
      changes.latitude !== undefined
        ? Number(changes.latitude)
        : currentLatitude;

    const updatedWifiSpot = {
      ...currentWifiSpot,
      ...(changes.name !== undefined && { name: changes.name.trim() }),
      ...(changes.type !== undefined && { type: changes.type }),
      ...(changes.status !== undefined && { status: changes.status }),
      ...(changes.description !== undefined && {
        description: changes.description.trim(),
      }),
      ...(changes.speedMbps !== undefined && {
        speedMbps: Number(changes.speedMbps),
      }),
      location: {
        type: "Point",
        coordinates: [updatedLongitude, updatedLatitude],
      },
      updatedAt: new Date().toISOString(),
    };

    this.wifiSpots[index] = updatedWifiSpot;
    return updatedWifiSpot;
  }

  async delete(id) {
    const index = this.wifiSpots.findIndex((wifiSpot) => wifiSpot.id === id);
    if (index === -1) {
      throw new AppError(
        404,
        `Zona WiFi no encontrada/inexistente con el id: ${id}`,
      );
    }
    const deletedWifiSpot = this.wifiSpots.splice(index, 1)[0];
    return deletedWifiSpot;
  }

  async getGeoJSON(filters = {}) {
    const wifiSpots = await this.getAll(filters);
    return {
      type: "FeatureCollection",
      features: wifiSpots.map((wifiSpot) => ({
        type: "Feature",
        properties: {
          id: wifiSpot.id,
          name: wifiSpot.name,
          type: wifiSpot.type,
          status: wifiSpot.status,
          description: wifiSpot.description,
          speedMbps: wifiSpot.speedMbps,
          createdAt: wifiSpot.createdAt,
          updatedAt: wifiSpot.updatedAt,
        },
        geometry: wifiSpot.location,
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

module.exports = WifiSpotsService;
