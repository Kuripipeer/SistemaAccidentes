"use strict"

const mongoose = require('mongoose');

// Esto abre la conexión con MongoDB usando la cadena de conexión del .env
async function connectDatabase() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("Falta la variable MONGODB_URI en el archivo .env");
    }

    await mongoose.connect(uri);

    console.log(`MongoDB conectado a la base: ${mongoose.connection.name}`);
}

// Esto desconecta de la base de datos (cierra y apaga el servidor)
async function disconnectDatabase() {
    await mongoose.disconnect();
}

module.exports = {connectDatabase, disconnectDatabase};