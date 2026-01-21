const Attendance = require("../models/Attendance");
const Event = require("../models/Event");
const QRCode = require("qrcode");

// Haversine formula
const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const toRad = (val) => (val * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const generateQRCode = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Event check
    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    // Generate QR code data (contains eventId)
    const qrData = JSON.stringify({
      eventId: eventId,
      eventName: event.title,
      timestamp: new Date().toISOString()
    });

    // Generate QR code as data URL
    const qrCodeUrl = await QRCode.toDataURL(qrData);

    res.json({
      qrCode: qrCodeUrl,
      eventId: eventId,
      eventName: event.title
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { eventId, latitude, longitude, qrCode } = req.body;

    // 1️⃣ Event check
    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    // 2️⃣ QR Code verification
    if (!qrCode) {
      return res.status(400).json({ message: "QR Code required for attendance" });
    }

    // 3️⃣ Duplicate check
    const alreadyMarked = await Attendance.findOne({
      student: req.user.id,
      event: eventId
    });
    if (alreadyMarked)
      return res.status(400).json({ message: "Attendance already marked" });

    // 4️⃣ Geo-fencing
    const distance = getDistanceInMeters(
      event.latitude,
      event.longitude,
      latitude,
      longitude
    );

    if (distance > event.radius) {
      return res
        .status(403)
        .json({ message: "Outside event geo-fence" });
    }

    // 5️⃣ Save attendance
    const attendance = await Attendance.create({
      student: req.user.id,
      event: eventId,
      latitude,
      longitude
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAttendanceByEvent = async (req, res) => {
  const data = await Attendance.find({
    event: req.params.eventId
  }).populate("student", "name email department");

  res.json(data);
};

module.exports = { markAttendance, getAttendanceByEvent, generateQRCode };
