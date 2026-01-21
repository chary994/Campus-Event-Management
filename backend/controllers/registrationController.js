const Registration = require("../models/Registration");
const Event = require("../models/Event");
const Notification = require("../models/Notification");

/* ================================
   STUDENT: REGISTER FOR EVENT
================================ */
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const studentId = req.user.id;

    // Check if user is admin
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: "Admins cannot register for events" });
    }

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check deadline
    const now = new Date();
    if (now > event.eventDeadline) {
      return res.status(400).json({ message: "Registration deadline has passed" });
    }

    // Check if already registered
    const existingReg = await Registration.findOne({
      student: studentId,
      event: eventId
    });

    if (existingReg) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    // Check available seats
    const registrationCount = await Registration.countDocuments({ event: eventId });
    if (registrationCount >= event.totalSeats) {
      return res.status(400).json({ message: "Event is full. No more seats available" });
    }

    // Create registration
    const registration = new Registration({
      student: studentId,
      event: eventId,
      registrationStatus: "registered"
    });

    await registration.save();

    // Update event registered count
    event.registeredCount = registrationCount + 1;
    await event.save();

    // Send confirmation notification
    await Notification.create({
      user: studentId,
      event: eventId,
      type: "registration_confirmed",
      title: "Registration Confirmed",
      message: `You have successfully registered for "${event.title}". Event date: ${event.eventDate.toDateString()}`
    });

    res.status(201).json({
      message: "Successfully registered for event",
      registration
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   STUDENT: CANCEL REGISTRATION
================================ */
exports.cancelRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const studentId = req.user.id;

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Check ownership
    if (registration.student.toString() !== studentId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const event = await Event.findById(registration.event);

    // Delete registration
    await Registration.findByIdAndDelete(registrationId);

    // Update registered count
    if (event) {
      const count = await Registration.countDocuments({ event: event._id });
      event.registeredCount = count;
      await event.save();
    }

    res.status(200).json({ message: "Registration cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   STUDENT: GET MY REGISTRATIONS
================================ */
exports.getMyRegistrations = async (req, res) => {
  try {
    const studentId = req.user.id;

    const registrations = await Registration.find({ student: studentId })
      .populate({
        path: "event",
        select: "title description locationName latitude longitude eventDate eventDeadline status department totalSeats registeredCount"
      })
      .sort({ registeredAt: -1 });

    const enrichedRegistrations = registrations.map((reg) => {
      const event = reg.event;
      return {
        registrationId: reg._id,
        registrationStatus: reg.registrationStatus,
        registeredAt: reg.registeredAt,
        event: {
          ...event.toObject(),
          availableSeats: event.totalSeats - event.registeredCount
        }
      };
    });

    res.status(200).json(enrichedRegistrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   ADMIN: GET EVENT REGISTRATIONS
================================ */
exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate("student", "name email")
      .sort({ registeredAt: -1 });

    const totalSeats = event.totalSeats;
    const registeredCount = registrations.length;
    const availableSeats = totalSeats - registeredCount;

    res.status(200).json({
      event: {
        id: event._id,
        title: event.title,
        totalSeats,
        registeredCount,
        availableSeats,
        registrations
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   CHECK REGISTRATION STATUS
================================ */
exports.checkRegistrationStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const studentId = req.user.id;

    const registration = await Registration.findOne({
      student: studentId,
      event: eventId
    });

    if (!registration) {
      return res.status(200).json({
        isRegistered: false,
        message: "Not registered for this event"
      });
    }

    res.status(200).json({
      isRegistered: true,
      registrationStatus: registration.registrationStatus,
      registeredAt: registration.registeredAt
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
