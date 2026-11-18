"use strict";

const app = require("./app");

const {
  connectDatabase,
  disconnectDatabase
} = require('./config/database')

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    // 1. Primero la base de datos se abre
    await connectDatabase();

    // 2. ... Y solo si conecto, levantamos el servidor
    const server = app.listen(PORT, () => {
      console.log("");
      console.log("==============================");
      console.log("API DE INCIDENTES URBANOS");
      console.log("==============================");
      console.log(`Servidor: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
      console.log(`Datos: http://localhost:${PORT}/api/incidents`);
      console.log(`GeoJSON: http://localhost:${PORT}/api/incidents/geojson`);
      console.log(`Bus Stops: http://localhost:${PORT}/api/bus-stops`);
      console.log(`Bus Stops GeoJSON: http://localhost:${PORT}/api/bus-stops/geojson`);
      console.log(`Hydrants: http://localhost:${PORT}/api/hydrants`);
      console.log(`Hydrants GeoJSON: http://localhost:${PORT}/api/hydrants/geojson`);
      console.log(`Stations: http://localhost:${PORT}/api/stations`);
      console.log(`Stations GeoJSON: http://localhost:${PORT}/api/stations/geojson`);
      console.log(`WiFi Spots: http://localhost:${PORT}/api/wifi-spots`);
      console.log(`WiFi Spots GeoJSON: http://localhost:${PORT}/api/wifi-spots/geojson`);
      console.log("==============================");
      console.log("");
    });

    // CIERRE CONTROLADO (Ctrl + c o cuando el sistema detiene el proceso)
    function shutdown(signal) {
      console.log(`\nSe recibio ${signal}. Cerrando servidor...`);
      
      server.close(async () => {
        await disconnectDatabase();
        console.log("Servidor cerrado corectamente.");
        process.exit(0);
      });
    }

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.log("No se pudo conectar al MongoDB", error.message);
    process.exit(1);
  }
}

startServer();