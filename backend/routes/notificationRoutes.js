const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendEventReminders,
  getNotificationById,
  getUnreadCount,
  broadcastNotification
} = require("../controllers/notificationController");

// Student routes
router.get("/", protect, getMyNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.get("/:notificationId", protect, getNotificationById);
router.put("/:notificationId/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);
router.delete("/:notificationId", protect, deleteNotification);

// Admin routes
router.post("/send-reminders", protect, isAdmin, sendEventReminders);
router.post("/broadcast", protect, isAdmin, broadcastNotification);

module.exports = router;
