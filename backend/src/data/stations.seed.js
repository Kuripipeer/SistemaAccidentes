"use strict";

const stations = [
  {
    id: "STA-001",
    name: "Estación Central de Bomberos León",
    type: "bomberos",
    status: "activa",
    description: "Estación central ubicada en Blvd. Adolfo López Mateos",
    units: 12,
    location: {
      type: "Point",
      coordinates: [-101.6715, 21.1205],
    },
    createdAt: "2026-01-15T12:00:00.000Z",
    updatedAt: "2026-01-16T12:00:00.000Z",
  },
  {
    id: "STA-002",
    name: "Delegación de Policía Poniente (Cepol)",
    type: "policia",
    status: "activa",
    description: "Comandancia de policía municipal zona poniente",
    units: 25,
    location: {
      type: "Point",
      coordinates: [-101.7012, 21.1325],
    },
    createdAt: "2026-01-16T12:00:00.000Z",
    updatedAt: "2026-01-17T12:00:00.000Z",
  },
  {
    id: "STA-003",
    name: "Base Protección Civil León",
    type: "proteccion_civil",
    status: "activa",
    description: "Base operativa de atención a emergencias y rescate",
    units: 8,
    location: {
      type: "Point",
      coordinates: [-101.6624, 21.1098],
    },
    createdAt: "2026-01-17T12:00:00.000Z",
    updatedAt: "2026-01-18T12:00:00.000Z",
  },
  {
    id: "STA-004",
    name: "Estación de Bomberos No. 3 Norte",
    type: "bomberos",
    status: "activa",
    description: "Estación de bomberos que brinda cobertura a la zona norte",
    units: 6,
    location: {
      type: "Point",
      coordinates: [-101.6845, 21.1592],
    },
    createdAt: "2026-01-18T12:00:00.000Z",
    updatedAt: "2026-01-19T12:00:00.000Z",
  },
  {
    id: "STA-005",
    name: "Caseta de Policía San Isidro",
    type: "policia",
    status: "inactiva",
    description: "Módulo de vigilancia en remodelación",
    units: 2,
    location: {
      type: "Point",
      coordinates: [-101.6489, 21.1052],
    },
    createdAt: "2026-01-19T12:00:00.000Z",
    updatedAt: "2026-01-20T12:00:00.000Z",
  },
  {
    id: "STA-006",
    name: "Módulo Protección Civil Sur",
    type: "proteccion_civil",
    status: "inactiva",
    description: "Subestación temporal fuera de operación por reubicación",
    units: 3,
    location: {
      type: "Point",
      coordinates: [-101.6352, 21.0815],
    },
    createdAt: "2026-01-20T12:00:00.000Z",
    updatedAt: "2026-01-21T12:00:00.000Z",
  },
];

module.exports = stations;
