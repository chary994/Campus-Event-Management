const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");
const User = require("../models/User");

/* ================================
   HELPER FUNCTION (HAVERSINE)
================================ */
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const toRad = (val) => (val * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ================================
   ADMIN: CREATE EVENT
================================ */
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      locationName,
      department,
      latitude,
      longitude,
      radius,
      eventDate,
      eventDeadline,
      totalSeats
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !locationName ||
      !department ||
      latitude === undefined ||
      longitude === undefined ||
      !eventDate ||
      !eventDeadline ||
      !totalSeats
    ) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Validate dates
    const deadline = new Date(eventDeadline);
    const eventDateObj = new Date(eventDate);
    if (deadline >= eventDateObj) {
      return res.status(400).json({ message: "Deadline must be before event date" });
    }

    const event = new Event({
      title,
      description,
      locationName,
      department,
      latitude,
      longitude,
      radius: radius || 100,
      eventDate: eventDateObj,
      eventDeadline: deadline,
      totalSeats,
      createdBy: req.user.id,
      status: "upcoming"
    });

    await event.save();

    // Send notifications to all users
    const allUsers = await User.find({ role: "student" });
    const notifications = allUsers.map((user) => ({
      user: user._id,
      event: event._id,
      type: "event_reminder",
      title: `New Event: ${title}`,
      message: `A new event "${title}" is available for registration in ${department}. Deadline: ${deadline.toDateString()}`
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      message: "Event created successfully",
      event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ================================
   GET ALL EVENTS (with details)
================================ */
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .sort({ eventDate: 1 });

    // Add registration details
    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const registrations = await Registration.countDocuments({
          event: event._id
        });
        return {
          ...event.toObject(),
          registeredCount: registrations,
          availableSeats: event.totalSeats - registrations
        };
      })
    );

    res.status(200).json(enrichedEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   GET SINGLE EVENT WITH DETAILS
================================ */
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate("createdBy", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registrations = await Registration.countDocuments({ event: eventId });

    res.status(200).json({
      ...event.toObject(),
      registeredCount: registrations,
      availableSeats: event.totalSeats - registrations
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   UPDATE EVENT (Admin only)
================================ */
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, locationName, latitude, longitude, radius, eventDate, eventDeadline, totalSeats, status } = req.body;

    const event = await Event.findByIdAndUpdate(
      eventId,
      { title, description, locationName, latitude, longitude, radius, eventDate, eventDeadline, totalSeats, status },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Notify registered students about update
    const registrations = await Registration.find({ event: eventId }).populate("student");
    const notifications = registrations.map((reg) => ({
      user: reg.student._id,
      event: eventId,
      type: "event_update",
      title: "Event Updated",
      message: `Event "${title}" has been updated. Please check for new details.`
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({
      message: "Event updated successfully",
      event
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   GET EVENTS BY DEPARTMENT
================================ */
exports.getEventsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const events = await Event.find({ department }).sort({ eventDate: 1 });

    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const registrations = await Registration.countDocuments({ event: event._id });
        return {
          ...event.toObject(),
          registeredCount: registrations,
          availableSeats: event.totalSeats - registrations
        };
      })
    );

    res.status(200).json(enrichedEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   GET EVENT DETAILS WITH LOCATION
================================ */
exports.getEventLocation = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      title: event.title,
      locationName: event.locationName,
      latitude: event.latitude,
      longitude: event.longitude,
      radius: event.radius,
      eventDate: event.eventDate
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   MARK ATTENDANCE WITH GEOFENCING
================================ */
exports.markAttendance = async (req, res) => {
  try {
    const { eventId, latitude, longitude } = req.body;

    if (!eventId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if already marked
    const alreadyMarked = await Attendance.findOne({
      event: eventId,
      student: req.user.id
    });

    if (alreadyMarked) {
      return res.status(400).json({ message: "Attendance already marked for this event" });
    }

    // Geofencing validation
    const distance = getDistanceInMeters(event.latitude, event.longitude, latitude, longitude);

    if (distance > event.radius) {
      return res.status(403).json({
        message: `You are outside the event location. Distance: ${Math.round(distance)}m, Allowed radius: ${event.radius}m`
      });
    }

    const attendance = new Attendance({
      student: req.user.id,
      event: eventId,
      latitude,
      longitude
    });

    await attendance.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   VIEW EVENT ATTENDANCE
================================ */
exports.getEventAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const attendance = await Attendance.find({ event: eventId })
      .populate("student", "name email")
      .sort({ markedAt: -1 });

    const totalRegistered = await Registration.countDocuments({ event: eventId });
    const totalAttended = attendance.length;

    res.status(200).json({
      eventTitle: event.title,
      totalRegistered,
      totalAttended,
      attendanceList: attendance
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
