"use strict";

const mongoose = require("mongoose");

const ALLOWED_TYPES = ["columna", "banqueta"];
const ALLOWED_STATUSES = ["funcional", "sin_presion", "dado_de_baja"];

const hydrantSchema = new mongoose.Schema(
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
    pressurePsi: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
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

hydrantSchema.index({ location: "2dsphere" });

const HydrantModel = mongoose.model("Hydrant", hydrantSchema);

module.exports = {
  HydrantModel,
  ALLOWED_TYPES,
  ALLOWED_STATUSES,
};
