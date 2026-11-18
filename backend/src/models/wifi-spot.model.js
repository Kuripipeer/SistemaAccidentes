"use strict";

const mongoose = require("mongoose");

const ALLOWED_TYPES = ["parque", "plaza", "edificio_publico"];
const ALLOWED_STATUSES = ["activa", "intermitente", "caida"];

const wifiSpotSchema = new mongoose.Schema(
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
    speedMbps: {
      type: Number,
      required: true,
      min: 0,
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

wifiSpotSchema.index({ location: "2dsphere" });

const WifiSpotModel = mongoose.model("WifiSpot", wifiSpotSchema);

module.exports = {
  WifiSpotModel,
  ALLOWED_TYPES,
  ALLOWED_STATUSES,
};
