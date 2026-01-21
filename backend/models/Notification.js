const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    },
    type: {
      type: String,
      enum: ["event_reminder", "registration_confirmed", "event_update", "system_alert"],
      required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: {
      type: Boolean,
      default: false
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    scheduledFor: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
