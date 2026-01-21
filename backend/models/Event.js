const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    eventDate: { type: Date, required: true },
    eventDeadline: { type: Date, required: true },
    
    locationName: { type: String, required: true },
    department: { type: String, required: true },
    
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    radius: {
      type: Number,
      default: 100 // meters
    },

    // Registration limits
    totalSeats: { type: Number, required: true, default: 0 },
    registeredCount: { type: Number, default: 0 },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
