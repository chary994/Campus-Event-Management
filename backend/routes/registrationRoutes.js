const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations,
  checkRegistrationStatus
} = require("../controllers/registrationController");

// Student routes
router.post("/register/:eventId", protect, registerForEvent);
router.delete("/:registrationId", protect, cancelRegistration);
router.get("/my-registrations", protect, getMyRegistrations);
router.get("/status/:eventId", protect, checkRegistrationStatus);

// Admin routes
router.get("/event/:eventId", protect, isAdmin, getEventRegistrations);

module.exports = router;
