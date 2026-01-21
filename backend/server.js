require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const NotificationService = require("./services/notificationService");

const app = express();
app.use(express.json());
app.use(cors());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/registrations", require("./routes/registrationRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/ratings", require("./routes/ratingRoutes"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running", timestamp: new Date() });
});

// Scheduled tasks (can be run by external scheduler or cron job)
// Option 1: Run every hour
if (process.env.ENABLE_SCHEDULED_TASKS === "true") {
  setInterval(async () => {
    try {
      await NotificationService.sendUpcomingEventReminders();
      await NotificationService.sendDeadlineWarnings();
      await NotificationService.sendCapacityAlerts();
    } catch (error) {
      console.error("Scheduled task error:", error);
    }
  }, 60 * 60 * 1000); // 1 hour

  // Clean old notifications daily
  setInterval(async () => {
    try {
      await NotificationService.cleanOldNotifications();
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }, 24 * 60 * 60 * 1000); // 24 hours

  console.log("✅ Scheduled notification tasks enabled");
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

