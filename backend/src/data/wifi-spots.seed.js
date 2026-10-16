"use strict";

const wifiSpots = [
  {
    id: "WIFI-001",
    name: "WiFi Parque Metropolitano",
    type: "parque",
    status: "activa",
    description: "Punto de acceso gratuito en zona de acceso norte del parque",
    speedMbps: 50.5,
    location: {
      type: "Point",
      coordinates: [-101.6895, 21.1715],
    },
    createdAt: "2026-01-15T12:00:00.000Z",
    updatedAt: "2026-01-16T12:00:00.000Z",
  },
  {
    id: "WIFI-002",
    name: "WiFi Plaza Principal (Plaza Mártires)",
    type: "plaza",
    status: "activa",
    description: "Red municipal frente a Presidencia Municipal",
    speedMbps: 85.0,
    location: {
      type: "Point",
      coordinates: [-101.6828, 21.1221],
    },
    createdAt: "2026-01-16T12:00:00.000Z",
    updatedAt: "2026-01-17T12:00:00.000Z",
  },
  {
    id: "WIFI-003",
    name: "WiFi Biblioteca Central Estatal Wigberto Jiménez",
    type: "edificio_publico",
    status: "activa",
    description: "Red pública de alta velocidad en explanada del Forum Cultural",
    speedMbps: 120.0,
    location: {
      type: "Point",
      coordinates: [-101.6608, 21.1152],
    },
    createdAt: "2026-01-17T12:00:00.000Z",
    updatedAt: "2026-01-18T12:00:00.000Z",
  },
  {
    id: "WIFI-004",
    name: "WiFi Parque Explora",
    type: "parque",
    status: "intermitente",
    description: "Señal con intermitencias por saturación de usuarios",
    speedMbps: 25.4,
    location: {
      type: "Point",
      coordinates: [-101.6562, 21.1118],
    },
    createdAt: "2026-01-18T12:00:00.000Z",
    updatedAt: "2026-01-19T12:00:00.000Z",
  },
  {
    id: "WIFI-005",
    name: "WiFi Plaza Expiatorio",
    type: "plaza",
    status: "activa",
    description: "Punto de acceso gratuito en la explanada del Templo Expiatorio",
    speedMbps: 60.0,
    location: {
      type: "Point",
      coordinates: [-101.6749, 21.1199],
    },
    createdAt: "2026-01-19T12:00:00.000Z",
    updatedAt: "2026-01-20T12:00:00.000Z",
  },
  {
    id: "WIFI-006",
    name: "WiFi Parque Hidalgo",
    type: "parque",
    status: "caida",
    description: "Antena en mantenimiento por falla eléctrica",
    speedMbps: 10.0,
    location: {
      type: "Point",
      coordinates: [-101.6945, 21.1268],
    },
    createdAt: "2026-01-20T12:00:00.000Z",
    updatedAt: "2026-01-21T12:00:00.000Z",
  },
];

module.exports = wifiSpots;
