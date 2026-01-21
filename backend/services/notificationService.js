const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Notification = require("../models/Notification");

/**
 * Service to handle event reminders and notifications
 * Can be called by a cron job or scheduling service
 */

class NotificationService {
  /**
   * Send reminders for events happening in the next 24 hours
   */
  static async sendUpcomingEventReminders() {
    try {
      const now = new Date();
      const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const upcomingEvents = await Event.find({
        eventDate: { $gte: now, $lte: oneDayLater },
        status: "upcoming"
      });

      let remindersSent = 0;

      for (const event of upcomingEvents) {
        const registrations = await Registration.find({ event: event._id });

        const notifications = registrations.map((reg) => ({
          user: reg.student,
          event: event._id,
          type: "event_reminder",
          title: `Event Reminder: ${event.title}`,
          message: `Your registered event "${event.title}" is happening tomorrow at ${event.locationName}. Don't miss it!`,
          sentAt: new Date()
        }));

        if (notifications.length > 0) {
          await Notification.insertMany(notifications);
          remindersSent += notifications.length;
        }
      }

      console.log(`✅ Event reminders sent: ${remindersSent} notifications`);
      return { success: true, remindersSent, eventsProcessed: upcomingEvents.length };
    } catch (error) {
      console.error("❌ Error sending event reminders:", error);
      throw error;
    }
  }

  /**
   * Send registration deadline warnings (24 hours before deadline)
   */
  static async sendDeadlineWarnings() {
    try {
      const now = new Date();
      const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const upcomingDeadlines = await Event.find({
        eventDeadline: { $gte: now, $lte: oneDayLater },
        status: "upcoming"
      });

      let warningsSent = 0;

      for (const event of upcomingDeadlines) {
        const registrations = await Registration.find({ event: event._id });

        // Get all students who haven't registered yet
        const registeredStudentIds = registrations.map((r) => r.student);

        const nonRegisteredStudents = await Event.db
          .collection("users")
          .find({
            _id: { $nin: registeredStudentIds },
            role: "student"
          })
          .toArray();

        const warnings = nonRegisteredStudents.map((student) => ({
          user: student._id,
          event: event._id,
          type: "event_reminder",
          title: `Registration Deadline Soon: ${event.title}`,
          message: `Registration for "${event.title}" closes on ${event.eventDeadline.toDateString()}. Register now to secure your seat!`
        }));

        if (warnings.length > 0) {
          await Notification.insertMany(warnings);
          warningsSent += warnings.length;
        }
      }

      console.log(`✅ Deadline warnings sent: ${warningsSent} notifications`);
      return { success: true, warningsSent, eventsProcessed: upcomingDeadlines.length };
    } catch (error) {
      console.error("❌ Error sending deadline warnings:", error);
      throw error;
    }
  }

  /**
   * Send notifications about event registration status (capacity alerts)
   */
  static async sendCapacityAlerts() {
    try {
      const events = await Event.find({
        status: { $in: ["upcoming", "ongoing"] }
      });

      let alertsSent = 0;

      for (const event of events) {
        const remainingSeats = event.totalSeats - event.registeredCount;

        // Alert admins if only 10% seats left
        if (remainingSeats <= event.totalSeats * 0.1 && remainingSeats > 0) {
          const admin = event.createdBy;

          await Notification.create({
            user: admin,
            event: event._id,
            type: "system_alert",
            title: "Capacity Alert",
            message: `Only ${remainingSeats} seat(s) remaining for "${event.title}"`
          });

          alertsSent++;
        }
      }

      console.log(`✅ Capacity alerts sent: ${alertsSent} notifications`);
      return { success: true, alertsSent };
    } catch (error) {
      console.error("❌ Error sending capacity alerts:", error);
      throw error;
    }
  }

  /**
   * Clean old notifications (older than 30 days)
   */
  static async cleanOldNotifications() {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const result = await Notification.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
        isRead: true
      });

      console.log(`✅ Cleaned old notifications: ${result.deletedCount} records deleted`);
      return { success: true, deletedCount: result.deletedCount };
    } catch (error) {
      console.error("❌ Error cleaning notifications:", error);
      throw error;
    }
  }

  /**
   * Send custom notification to specific users
   */
  static async sendCustomNotification(userIds, title, message, type = "system_alert") {
    try {
      const notifications = userIds.map((userId) => ({
        user: userId,
        type,
        title,
        message,
        sentAt: new Date()
      }));

      const result = await Notification.insertMany(notifications);
      console.log(`✅ Custom notification sent to ${result.length} users`);
      return { success: true, notificationCount: result.length };
    } catch (error) {
      console.error("❌ Error sending custom notification:", error);
      throw error;
    }
  }
}

module.exports = NotificationService;
