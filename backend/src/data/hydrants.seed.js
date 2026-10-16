"use strict";

const hydrants = [
  {
    id: "HYD-001",
    name: "Hidrante Zona Piel",
    type: "columna",
    status: "funcional",
    description: "Hidrante de columna en esquina comercial cerca de la Central Camionera",
    pressurePsi: 120.5,
    location: {
      type: "Point",
      coordinates: [-101.6661, 21.1165],
    },
    createdAt: "2026-01-15T12:00:00.000Z",
    updatedAt: "2026-01-16T12:00:00.000Z",
  },
  {
    id: "HYD-002",
    name: "Hidrante Plaza Mayor",
    type: "columna",
    status: "funcional",
    description: "Hidrante sobre Blvd. Juan Alonso de Torres",
    pressurePsi: 135.0,
    location: {
      type: "Point",
      coordinates: [-101.6968, 21.1565],
    },
    createdAt: "2026-01-16T12:00:00.000Z",
    updatedAt: "2026-01-17T12:00:00.000Z",
  },
  {
    id: "HYD-003",
    name: "Hidrante Calzada de los Héroes",
    type: "banqueta",
    status: "funcional",
    description: "Hidrante de banqueta cerca del Arco de la Calzada",
    pressurePsi: 110.2,
    location: {
      type: "Point",
      coordinates: [-101.6738, 21.1192],
    },
    createdAt: "2026-01-17T12:00:00.000Z",
    updatedAt: "2026-01-18T12:00:00.000Z",
  },
  {
    id: "HYD-004",
    name: "Hidrante Barrio de San Juan de Dios",
    type: "banqueta",
    status: "sin_presion",
    description: "Hidrante con baja presión reportada en la red local",
    pressurePsi: 0.0,
    location: {
      type: "Point",
      coordinates: [-101.6782, 21.1171],
    },
    createdAt: "2026-01-18T12:00:00.000Z",
    updatedAt: "2026-01-19T12:00:00.000Z",
  },
  {
    id: "HYD-005",
    name: "Hidrante Parque Industrial Julian de Obregón",
    type: "columna",
    status: "funcional",
    description: "Hidrante de alta presión para zona industrial",
    pressurePsi: 150.8,
    location: {
      type: "Point",
      coordinates: [-101.6312, 21.0895],
    },
    createdAt: "2026-01-19T12:00:00.000Z",
    updatedAt: "2026-01-20T12:00:00.000Z",
  },
  {
    id: "HYD-006",
    name: "Hidrante Coecillo",
    type: "banqueta",
    status: "dado_de_baja",
    description: "Hidrante dañado por impacto vehicular, pendiente de reemplazo",
    pressurePsi: 0.0,
    location: {
      type: "Point",
      coordinates: [-101.6689, 21.1255],
    },
    createdAt: "2026-01-20T12:00:00.000Z",
    updatedAt: "2026-01-21T12:00:00.000Z",
  },
];

module.exports = hydrants;
