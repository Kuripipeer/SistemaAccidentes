"use strict";

const busStops = [
  {
    id: "BUS-001",
    name: "Estación San Jerónimo",
    type: "troncal",
    status: "operando",
    description: "Terminal de transferencia principal norte del SIT",
    routesCount: 15,
    location: {
      type: "Point",
      coordinates: [-101.6789, 21.1512],
    },
    createdAt: "2026-01-15T12:00:00.000Z",
    updatedAt: "2026-01-16T12:00:00.000Z",
  },
  {
    id: "BUS-002",
    name: "Estación Delta",
    type: "troncal",
    status: "operando",
    description: "Terminal de transferencia zona sur-oriente",
    routesCount: 18,
    location: {
      type: "Point",
      coordinates: [-101.6285, 21.0975],
    },
    createdAt: "2026-01-16T12:00:00.000Z",
    updatedAt: "2026-01-17T12:00:00.000Z",
  },
  {
    id: "BUS-003",
    name: "Parada Poliforum",
    type: "troncal",
    status: "operando",
    description: "Parada sobre Blvd. Adolfo López Mateos frente al Poliforum",
    routesCount: 6,
    location: {
      type: "Point",
      coordinates: [-101.6582, 21.1135],
    },
    createdAt: "2026-01-17T12:00:00.000Z",
    updatedAt: "2026-01-18T12:00:00.000Z",
  },
  {
    id: "BUS-004",
    name: "Parada Jardines del Moral",
    type: "alimentadora",
    status: "operando",
    description: "Parada de ruta alimentadora en Av. Paseo del Moral",
    routesCount: 3,
    location: {
      type: "Point",
      coordinates: [-101.6934, 21.1485],
    },
    createdAt: "2026-01-18T12:00:00.000Z",
    updatedAt: "2026-01-19T12:00:00.000Z",
  },
  {
    id: "BUS-005",
    name: "Parada Centro Histórico",
    type: "auxiliar",
    status: "suspendida",
    description: "Parada temporalmente cerrada por obras viales en el centro",
    routesCount: 4,
    location: {
      type: "Point",
      coordinates: [-101.6825, 21.1219],
    },
    createdAt: "2026-01-19T12:00:00.000Z",
    updatedAt: "2026-01-20T12:00:00.000Z",
  },
  {
    id: "BUS-006",
    name: "Parada Las Joyas",
    type: "alimentadora",
    status: "suspendida",
    description: "Parada en mantenimiento de infraestructura",
    routesCount: 2,
    location: {
      type: "Point",
      coordinates: [-101.7345, 21.1298],
    },
    createdAt: "2026-01-20T12:00:00.000Z",
    updatedAt: "2026-01-21T12:00:00.000Z",
  },
];

module.exports = busStops;
