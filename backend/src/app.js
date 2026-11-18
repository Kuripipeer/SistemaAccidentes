"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routerApi = require("./routes");
const AppError = require("./utils/appError")
const {
  notFoundHandler,
  logErrors,
  errorHandler,
} = require("./middlewares/error.handler");

const app = express();
// ORIGENES PERMITIDOS (vienen del .env separados por coma)
const  allowedOrigins = (process.env.FRONTEND_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// CORS
app.use(
  cors({
    origin(origin, callback){
      // POSTMAN, REST Client y curl no siempre envian ORIGIN
      if(!origin){
        return callback(null, true);
      }

      // Si no se configuraron origenes, se permite todo (desarrollo)
      if (allowedOrigins.length === 0) {
        return callback(null, true);
      }

      if(allowedOrigins.includes(origin)){
        return callback(null, true);
      }

      return callback(
        new AppError(403, `El origin ${origin} no esta permitido por CORS`)
      )
    }
  }));

// PROCESAR JSON (maximo 100kb por peticion)
app.use(express.json({ limit: "100kb"}));

app.use((req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  
  next();
})

// RUTA PRINCIPAL
app.get("/", (req, res) => {
  res.status(200).json({
    name: "API de Incidentes Urbanos",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      incidents: "/api/incidents",
      geojson: "/api/incidents/geojson",
      busStops: "/api/bus-stops",
      hydrants: "/api/hydrants",
      stations: "/api/stations",
      wifiSpots: "/api/wifi-spots"
    },
  });
});

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "El servidor funciona correctamente",
    timestamp: new Date().toISOString(),
  });
});

// RUTAS DE LA API
routerApi(app);

// MANEJO DE ERRORES (Siempre despues de las rutas y en este orden)
app.use(notFoundHandler);
app.use(logErrors);
app.use(errorHandler);

module.exports = app;
