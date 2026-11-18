"use strict";

const AppError = require("../utils/appError");
const { ALLOWED_TYPES, ALLOWED_STATUSES } = require("../models/wifi-spot.model");

const ALLOWED_FIELDS = [
  "name",
  "type",
  "status",
  "description",
  "speedMbps",
  "latitude",
  "longitude",
];

function validateWifiSpotPayload(options = {}) {
  const { partial = false } = options;
  return function wifiSpotPayloadValidator(req, res, next) {
    const errors = [];
    const body = req.body || {};

    const providedFields = ALLOWED_FIELDS.filter(
      (field) => body[field] !== undefined
    );

    if (partial && providedFields.length === 0) {
      errors.push("Debes proporcionar al menos un campo para actualizar");
    }

    if (!partial) {
      ALLOWED_FIELDS.forEach((field) => {
        if (
          body[field] === undefined ||
          body[field] === null ||
          body[field] === ""
        ) {
          errors.push(`El campo "${field}" es obligatorio`);
        }
      });
    }

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.trim().length < 3) {
        errors.push("El nombre debe contener al menos 3 caracteres.");
      }
      if (typeof body.name !== "string" || body.name.trim().length > 100) {
        errors.push("El nombre no debe superar 100 caracteres.");
      }
    }

    if (body.type !== undefined && !ALLOWED_TYPES.includes(body.type)) {
      errors.push(`El tipo debe ser uno de los siguientes: ${ALLOWED_TYPES.join(", ")}`);
    }

    if (body.status !== undefined && !ALLOWED_STATUSES.includes(body.status)) {
      errors.push(`El estado debe ser: ${ALLOWED_STATUSES.join(", ")}`);
    }

    if (body.description !== undefined) {
      if (typeof body.description !== "string" || body.description.trim().length < 5) {
        errors.push("La descripción debe contener al menos 5 caracteres.");
      }
      if (typeof body.description !== "string" || body.description.trim().length > 250) {
        errors.push("La descripción no debe superar 250 caracteres.");
      }
    }

    if (body.speedMbps !== undefined) {
      const speed = Number(body.speedMbps);
      if (!Number.isFinite(speed) || speed <= 0) {
        errors.push("speedMbps debe ser un número decimal mayor a 0.");
      } else {
        req.body.speedMbps = speed;
      }
    }

    if (body.latitude !== undefined) {
      const latitude = Number(body.latitude);
      if (!Number.isFinite(latitude)) {
        errors.push("La latitud debe ser numérica");
      } else if (latitude < -90 || latitude > 90) {
        errors.push("La latitud debe estar entre -90 y 90.");
      } else {
        req.body.latitude = latitude;
      }
    }

    if (body.longitude !== undefined) {
      const longitude = Number(body.longitude);
      if (!Number.isFinite(longitude)) {
        errors.push("La longitud debe ser numérica");
      } else if (longitude < -180 || longitude > 180) {
        errors.push("La longitud debe estar entre -180 y 180.");
      } else {
        req.body.longitude = longitude;
      }
    }

    const unknownFields = Object.keys(body).filter(
      (field) => !ALLOWED_FIELDS.includes(field)
    );

    if (unknownFields.length > 0) {
      errors.push(`Campos no permitidos: ${unknownFields.join(", ")}`);
    }

    if (errors.length > 0) {
      return next(
        new AppError(400, "La información enviada no es válida.", errors)
      );
    }

    next();
  };
}

function validateWifiSpotQuery(req, res, next) {
  const errors = [];
  const { search, type, status } = req.query;

  if (search !== undefined && typeof search !== "string") {
    errors.push("El parámetro search debe ser texto");
  }

  if (type !== undefined && type !== "all" && !ALLOWED_TYPES.includes(type)) {
    errors.push("El tipo de filtrado no es válido");
  }

  if (status !== undefined && status !== "all" && !ALLOWED_STATUSES.includes(status)) {
    errors.push("El estado de filtrado no es válido");
  }

  if (errors.length > 0) {
    return next(
      new AppError(400, "Los parámetros de consulta no son válidos", errors)
    );
  }

  next();
}

module.exports = {
  validateWifiSpotPayload,
  validateWifiSpotQuery,
};
