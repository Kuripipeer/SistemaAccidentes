"use strict";

const app = require("./app");

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
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
