"use strict";

const mongoose = require("mongoose");

const ALLOWED_TYPES = ["troncal", "alimentadora", "auxiliar"];
const ALLOWED_STATUSES = ["operando", "suspendida"];

const busStopSchema = new mongoose.Schema(
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
    routesCount: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
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

busStopSchema.index({ location: "2dsphere" });

const BusStopModel = mongoose.model("BusStop", busStopSchema);

module.exports = {
  BusStopModel,
  ALLOWED_TYPES,
  ALLOWED_STATUSES,
};
