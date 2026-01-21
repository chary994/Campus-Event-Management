const Notification = require("../models/Notification");
const Event = require("../models/Event");
const User = require("../models/User");
const Registration = require("../models/Registration");

/* ================================
   GET MY NOTIFICATIONS
================================ */
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ user: userId })
      .populate("event", "title eventDate department")
      .sort({ sentAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: userId,
      isRead: false
    });

    res.status(200).json({
      unreadCount,
      notifications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   MARK NOTIFICATION AS READ
================================ */
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Verify ownership
    if (notification.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      message: "Marked as read",
      notification
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   MARK ALL NOTIFICATIONS AS READ
================================ */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   DELETE NOTIFICATION
================================ */
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Verify ownership
    if (notification.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   SEND EVENT REMINDERS (Admin/Cron Job)
================================ */
exports.sendEventReminders = async (req, res) => {
  try {
    const now = new Date();
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find events happening in the next 24 hours
    const upcomingEvents = await Event.find({
      eventDate: { $gte: now, $lte: oneDayLater },
      status: "upcoming"
    });

    let remindersSent = 0;

    for (const event of upcomingEvents) {
      // Get all registered students
      const registrations = await Registration.find({ event: event._id });

      // Create notifications for each student
      const notificationPromises = registrations.map((reg) =>
        Notification.create({
          user: reg.student,
          event: event._id,
          type: "event_reminder",
          title: `Reminder: ${event.title}`,
          message: `Event "${event.title}" is happening on ${event.eventDate.toDateString()} at ${event.locationName}. See you there!`
        })
      );

      await Promise.all(notificationPromises);
      remindersSent += registrations.length;
    }

    res.status(200).json({
      message: "Reminders sent successfully",
      eventsProcessed: upcomingEvents.length,
      remindersSent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   GET NOTIFICATION BY ID
================================ */
exports.getNotificationById = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findById(notificationId)
      .populate("event", "title eventDate department");

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Verify ownership
    if (notification.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   GET UNREAD COUNT
================================ */
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Notification.countDocuments({
      user: userId,
      isRead: false
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   BROADCAST NOTIFICATION (Admin Only)
================================ */
exports.broadcastNotification = async (req, res) => {
  try {
    const { title, message, type = "system_alert" } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    // Get all users
    const users = await User.find();

    // Create notifications for all users
    const notifications = users.map((user) => ({
      user: user._id,
      type,
      title,
      message
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    res.status(201).json({
      message: "Notifications broadcast successfully",
      count: createdNotifications.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
