const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");
const {
  markAttendance,
  getAttendanceByEvent,
  generateQRCode
} = require("../controllers/attendanceController");

router.post("/mark", protect, markAttendance);
router.get("/:eventId", protect, isAdmin, getAttendanceByEvent);
router.get("/qr/:eventId", protect, isAdmin, generateQRCode);

module.exports = router;
