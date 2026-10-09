"use strict";

const incidents = [
  {
    id: "INC-001",
    title: "Bache frente a la universidad",
    category: "bache",
    description: "Bache profundo que dificulta el paso de vehículos",
    status: "pendiente",
    location:{
        type: "Point",
        coordinates: [-101.6812, 21.1248]
    },
    createdAt: "2026-01-15T12:00:00.000Z",
    updateAt: "2026-01-16T12:00:00.000Z"
  },

  {
    id: "INC-002",
    title: "Luminaria sin funcionar",
    category: "alumbrado",
    description: "La calle permanece oscura durante la noche",
    status: "atendido",
    location:{
        type: "Point",
        coordinates: [-101.6751, 21.1195]
    },
    createdAt: "2026-01-16T12:00:00.000Z",
    updateAt: "2026-01-15T12:00:00.000Z"
  },

  {
    id: "INC-003",
    title: "Acumulación de basura",
    category: "basura",
    description: "Hay residuos acumulados junto al parque",
    status: "pendiente",
    location:{
        type: "Point",
        coordinates: [-101.688, 21.1271]
    },
    createdAt: "2026-01-17T12:00:00.000Z",
    updateAt: "2026-01-18T12:00:00.000Z"
  },

  {
    id: "INC-004",
    title: "Fuga en tubería principal",
    category: "fuga",
    description: "Se observa una corriente constante de agua",
    status: "pendiente",
    location:{
        type: "Point",
        coordinates: [-101.6754, 21.1158]
    },
    createdAt: "2026-01-18T12:00:00.000Z",
    updateAt: "2026-01-19T12:00:00.000Z"
  },

  {
    id: "INC-005",
    title: "Accidente vehicular",
    category: "accidente",
    description: "Choque menor, se recomienda circular con precaución",
    status: "atendido",
    location:{
        type: "Point",
        coordinates: [-101.6923, 21.121]
    },
    createdAt: "2026-01-19T12:00:00.000Z",
    updateAt: "2026-01-20T12:00:00.000Z"
  },
];

module.exports = incidents;