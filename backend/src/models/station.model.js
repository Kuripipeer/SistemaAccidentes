"use strict";

const mongoose = require("mongoose");

const ALLOWED_TYPES = ["bomberos", "policia", "proteccion_civil"];
const ALLOWED_STATUSES = ["activa", "inactiva"];

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    type: {
      type: String,
      required: true,
      enum: ALLOWED_TYPES,
    },
    status: {
      type: String,
      required: true,
      enum: ALLOWED_STATUSES,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 250,
    },
    units: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

stationSchema.index({ location: "2dsphere" });

const StationModel = mongoose.model("Station", stationSchema);

module.exports = {
  StationModel,
  ALLOWED_TYPES,
  ALLOWED_STATUSES,
};
