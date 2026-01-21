const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    registrationStatus: {
      type: String,
      enum: ["registered", "attended", "cancelled"],
      default: "registered"
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Ensure one student can only register once per event
registrationSchema.index({ student: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
