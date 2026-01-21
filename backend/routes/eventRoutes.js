const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  getEventsByDepartment,
  getEventLocation,
  markAttendance,
  getEventAttendance
} = require("../controllers/eventController");

// Public routes
router.get("/", protect, getAllEvents);
router.get("/:eventId", protect, getEventById);
router.get("/location/:eventId", protect, getEventLocation);
router.get("/department/:department", protect, getEventsByDepartment);

// Admin routes
router.post("/create", protect, isAdmin, createEvent);
router.put("/:eventId", protect, isAdmin, updateEvent);
router.get("/attendance/:eventId", protect, isAdmin, getEventAttendance);

// Student routes
router.post("/attendance/mark", protect, markAttendance);

module.exports = router;
