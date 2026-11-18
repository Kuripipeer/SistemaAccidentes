"use-strict"

const mongoose = require('mongoose');

const {
    ALLOWED_CATEGORIES,
    ALLOWED_STATUSES
} = require('../middlewares/incident.validator');

const incidentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxLength: 80
        },
        category: {
            type: String,
            required: true,
            enum: ALLOWED_CATEGORIES
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxLength: 250
        },
        status: {
            type: String,
            required: true,
            enum: ALLOWED_STATUSES
        },
        // Ubicacion en formato GEOJSON: [longitud, latitud]
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    {
        // Agregamos createdAt y updatedAt automaticamente
        timestamps: true,

        // Como se ve el documento al enviarlo como JSON
        toJSON: {
            versionKey: false,
            transform(doc, ret){
                ret.id = ret._id.toString();
                delete ret._id;
                return ret;
            }
        }
    }
);

// Indice geoespacial: Permite consultar por cercanias mas adelante
incidentSchema.index({ location: "2dsphere" });

// modelo "Incident" -> coleccion "incidents" en MongoDB
const IncidentModel = mongoose.model("Incident", incidentSchema);

module.exports = IncidentModel;