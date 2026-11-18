"use strict";

require("dotenv").config();

const { connectDatabase, disconnectDatabase } = require("../config/database");

const IncidentModel = require("../models/incident.model");
const { BusStopModel } = require("../models/bus-stop.model");
const { HydrantModel } = require("../models/hydrant.model");
const { StationModel } = require("../models/station.model");
const { WifiSpotModel } = require("../models/wifi-spot.model");

const seedIncidents = require("./incidents.seed");
const seedBusStops = require("./bus-stops.seed");
const seedHydrants = require("./hydrants.seed");
const seedStations = require("./stations.seed");
const seedWifiSpots = require("./wifi-spots.seed");

function stripIds(seedArray) {
  return seedArray.map(({ id, createdAt, updatedAt, ...rest }) => rest);
}

async function runSeed() {
  try {
    await connectDatabase();

    // 1. Limpiar colecciones
    await Promise.all([
      IncidentModel.deleteMany({}),
      BusStopModel.deleteMany({}),
      HydrantModel.deleteMany({}),
      StationModel.deleteMany({}),
      WifiSpotModel.deleteMany({}),
    ]);

    // 2. Insertar registros de cada entidad
    const [incidents, busStops, hydrants, stations, wifiSpots] =
      await Promise.all([
        IncidentModel.insertMany(stripIds(seedIncidents)),
        BusStopModel.insertMany(stripIds(seedBusStops)),
        HydrantModel.insertMany(stripIds(seedHydrants)),
        StationModel.insertMany(stripIds(seedStations)),
        WifiSpotModel.insertMany(stripIds(seedWifiSpots)),
      ]);

    console.log("-----------------------------------------");
    console.log("SEEDS CARGADOS CORRECTAMENTE EN MONGODB:");
    console.log(`- Incidentes: ${incidents.length}`);
    console.log(`- Paradas de transporte: ${busStops.length}`);
    console.log(`- Hidrantes: ${hydrants.length}`);
    console.log(`- Estaciones de emergencia: ${stations.length}`);
    console.log(`- Zonas WiFi: ${wifiSpots.length}`);
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("Error al cargar los datos:", error.message);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

runSeed();
