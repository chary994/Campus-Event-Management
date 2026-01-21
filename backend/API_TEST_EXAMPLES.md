# Campus Event Management API - Test Examples

Use these examples to test the API with tools like Postman, Insomnia, or curl.

---

## 🔑 Authentication

### 1. Register a New User (Admin)
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@college.edu",
  "password": "admin123",
  "role": "admin"
}
```

**Response (201)**:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "USER_ID_1",
    "name": "Admin User",
    "email": "admin@college.edu",
    "role": "admin"
  }
}
```

---

### 2. Register Multiple Students
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "student123",
  "role": "student"
}
```

```bash
POST http://localhost:5000/api/auth/register

{
  "name": "Jane Smith",
  "email": "jane@college.edu",
  "password": "student123",
  "role": "student"
}
```

---

### 3. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@college.edu",
  "password": "admin123"
}
```

**Response (200)**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USER_ID_1",
    "name": "Admin User",
    "email": "admin@college.edu",
    "role": "admin"
  }
}
```

**Save the token**: Use in all subsequent requests as:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📅 Event Management

### 4. Create Event (Admin Only)
```bash
POST http://localhost:5000/api/events/create
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "title": "Tech Fest 2024",
  "description": "Annual college technology festival with competitions and seminars",
  "department": "Computer Science",
  "locationName": "Central Auditorium, Building A",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "radius": 150,
  "eventDate": "2024-02-15T10:00:00Z",
  "eventDeadline": "2024-02-10T23:59:59Z",
  "totalSeats": 500
}
```

**Response (201)**:
```json
{
  "message": "Event created successfully",
  "event": {
    "_id": "EVENT_ID_1",
    "title": "Tech Fest 2024",
    "department": "Computer Science",
    "registeredCount": 0,
    "status": "upcoming"
  }
}
```

---

### 5. Create Multiple Events
```bash
POST http://localhost:5000/api/events/create
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "title": "Annual Sports Meet",
  "description": "Inter-departmental sports competition",
  "department": "Physical Education",
  "locationName": "Main Sports Ground",
  "latitude": 28.7050,
  "longitude": 77.1030,
  "radius": 200,
  "eventDate": "2024-02-20T09:00:00Z",
  "eventDeadline": "2024-02-18T18:00:00Z",
  "totalSeats": 1000
}
```

```bash
POST http://localhost:5000/api/events/create
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "title": "Cultural Night",
  "description": "Showcase of cultural talents",
  "department": "Arts",
  "locationName": "Open Air Theater",
  "latitude": 28.7035,
  "longitude": 77.1020,
  "radius": 100,
  "eventDate": "2024-02-25T18:00:00Z",
  "eventDeadline": "2024-02-23T23:59:59Z",
  "totalSeats": 300
}
```

---

### 6. Get All Events
```bash
GET http://localhost:5000/api/events
Authorization: Bearer {TOKEN}
```

**Response (200)**:
```json
[
  {
    "_id": "EVENT_ID_1",
    "title": "Tech Fest 2024",
    "description": "...",
    "department": "Computer Science",
    "registeredCount": 45,
    "availableSeats": 455,
    "eventDate": "2024-02-15T10:00:00Z",
    "eventDeadline": "2024-02-10T23:59:59Z",
    "status": "upcoming",
    "totalSeats": 500
  },
  {
    "_id": "EVENT_ID_2",
    "title": "Annual Sports Meet",
    "registeredCount": 120,
    "availableSeats": 880,
    ...
  }
]
```

---

### 7. Get Single Event Details
```bash
GET http://localhost:5000/api/events/{EVENT_ID_1}
Authorization: Bearer {TOKEN}
```

**Response (200)**:
```json
{
  "_id": "EVENT_ID_1",
  "title": "Tech Fest 2024",
  "description": "Annual college technology festival with competitions and seminars",
  "department": "Computer Science",
  "locationName": "Central Auditorium, Building A",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "radius": 150,
  "eventDate": "2024-02-15T10:00:00Z",
  "eventDeadline": "2024-02-10T23:59:59Z",
  "totalSeats": 500,
  "registeredCount": 45,
  "availableSeats": 455,
  "status": "upcoming"
}
```

---

### 8. Get Event Location
```bash
GET http://localhost:5000/api/events/location/{EVENT_ID_1}
Authorization: Bearer {TOKEN}
```

**Response (200)**:
```json
{
  "title": "Tech Fest 2024",
  "locationName": "Central Auditorium, Building A",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "radius": 150,
  "eventDate": "2024-02-15T10:00:00Z"
}
```

---

### 9. Get Events by Department
```bash
GET http://localhost:5000/api/events/department/Computer%20Science
Authorization: Bearer {TOKEN}
```

**Response (200)**:
```json
[
  {
    "_id": "EVENT_ID_1",
    "title": "Tech Fest 2024",
    "department": "Computer Science",
    "registeredCount": 45,
    "availableSeats": 455,
    ...
  }
]
```

---

### 10. Update Event (Admin Only)
```bash
PUT http://localhost:5000/api/events/{EVENT_ID_1}
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "title": "Tech Fest 2024 - Updated",
  "totalSeats": 600,
  "status": "ongoing"
}
```

**Response (200)**:
```json
{
  "message": "Event updated successfully",
  "event": {
    "_id": "EVENT_ID_1",
    "title": "Tech Fest 2024 - Updated",
    "totalSeats": 600,
    "status": "ongoing",
    ...
  }
}
```

---

## 📝 Registration Management

### 11. Register for Event (Student)
```bash
POST http://localhost:5000/api/registrations/register
Authorization: Bearer {STUDENT_TOKEN}
Content-Type: application/json

{
  "eventId": "EVENT_ID_1"
}
```

**Response (201)**:
```json
{
  "message": "Successfully registered for event",
  "registration": {
    "_id": "REG_ID_1",
    "student": "STUDENT_ID",
    "event": "EVENT_ID_1",
    "registrationStatus": "registered",
    "registeredAt": "2024-02-01T10:30:00Z"
  }
}
```

---

### 12. Register Multiple Students for Same Event
```bash
POST http://localhost:5000/api/registrations/register
Authorization: Bearer {STUDENT2_TOKEN}

{
  "eventId": "EVENT_ID_1"
}
```

---

### 13. View My Registrations
```bash
GET http://localhost:5000/api/registrations/my-registrations
Authorization: Bearer {STUDENT_TOKEN}
```

**Response (200)**:
```json
[
  {
    "registrationId": "REG_ID_1",
    "registrationStatus": "registered",
    "registeredAt": "2024-02-01T10:30:00Z",
    "event": {
      "_id": "EVENT_ID_1",
      "title": "Tech Fest 2024",
      "eventDate": "2024-02-15T10:00:00Z",
      "registeredCount": 45,
      "availableSeats": 455
    }
  },
  {
    "registrationId": "REG_ID_2",
    "registrationStatus": "registered",
    "registeredAt": "2024-02-02T14:15:00Z",
    "event": {
      "_id": "EVENT_ID_2",
      "title": "Annual Sports Meet",
      "eventDate": "2024-02-20T09:00:00Z",
      "registeredCount": 120,
      "availableSeats": 880
    }
  }
]
```

---

### 14. Check Registration Status
```bash
GET http://localhost:5000/api/registrations/status/{EVENT_ID_1}
Authorization: Bearer {STUDENT_TOKEN}
```

**Response (200)** - Already Registered:
```json
{
  "isRegistered": true,
  "registrationStatus": "registered",
  "registeredAt": "2024-02-01T10:30:00Z"
}
```

**Response (200)** - Not Registered:
```json
{
  "isRegistered": false,
  "message": "Not registered for this event"
}
```

---

### 15. View Event Registrations (Admin)
```bash
GET http://localhost:5000/api/registrations/event/{EVENT_ID_1}
Authorization: Bearer {ADMIN_TOKEN}
```

**Response (200)**:
```json
{
  "event": {
    "id": "EVENT_ID_1",
    "title": "Tech Fest 2024",
    "totalSeats": 500,
    "registeredCount": 45,
    "availableSeats": 455,
    "registrations": [
      {
        "student": {
          "name": "John Doe",
          "email": "john@college.edu"
        },
        "registrationStatus": "registered",
        "registeredAt": "2024-02-01T10:30:00Z"
      },
      {
        "student": {
          "name": "Jane Smith",
          "email": "jane@college.edu"
        },
        "registrationStatus": "registered",
        "registeredAt": "2024-02-01T11:00:00Z"
      }
    ]
  }
}
```

---

### 16. Cancel Registration
```bash
DELETE http://localhost:5000/api/registrations/{REG_ID_1}
Authorization: Bearer {STUDENT_TOKEN}
```

**Response (200)**:
```json
{
  "message": "Registration cancelled successfully"
}
```

---

## 📍 Attendance Marking (Geofencing)

### 17. Mark Attendance (Within Geofence)
```bash
POST http://localhost:5000/api/events/attendance/mark
Authorization: Bearer {STUDENT_TOKEN}
Content-Type: application/json

{
  "eventId": "EVENT_ID_1",
  "latitude": 28.7041,
  "longitude": 77.1025
}
```

**Response (201)**:
```json
{
  "message": "Attendance marked successfully",
  "attendance": {
    "_id": "ATT_ID_1",
    "student": "STUDENT_ID",
    "event": "EVENT_ID_1",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "markedAt": "2024-02-15T10:15:00Z"
  }
}
```

---

### 18. Mark Attendance (Outside Geofence)
```bash
POST http://localhost:5000/api/events/attendance/mark
Authorization: Bearer {STUDENT_TOKEN}
Content-Type: application/json

{
  "eventId": "EVENT_ID_1",
  "latitude": 28.7100,
  "longitude": 77.1100
}
```

**Response (403)**:
```json
{
  "message": "You are outside the event location. Distance: 8400m, Allowed radius: 150m"
}
```

---

### 19. View Event Attendance (Admin)
```bash
GET http://localhost:5000/api/events/attendance/{EVENT_ID_1}
Authorization: Bearer {ADMIN_TOKEN}
```

**Response (200)**:
```json
{
  "eventTitle": "Tech Fest 2024",
  "totalRegistered": 45,
  "totalAttended": 42,
  "attendanceList": [
    {
      "student": {
        "name": "John Doe",
        "email": "john@college.edu"
      },
      "markedAt": "2024-02-15T10:15:00Z",
      "latitude": 28.7041,
      "longitude": 77.1025
    },
    {
      "student": {
        "name": "Jane Smith",
        "email": "jane@college.edu"
      },
      "markedAt": "2024-02-15T10:20:00Z",
      "latitude": 28.7042,
      "longitude": 77.1026
    }
  ]
}
```

---

## 🔔 Notifications

### 20. Get My Notifications
```bash
GET http://localhost:5000/api/notifications
Authorization: Bearer {STUDENT_TOKEN}
```

**Response (200)**:
```json
{
  "unreadCount": 3,
  "notifications": [
    {
      "_id": "NOT_ID_1",
      "type": "registration_confirmed",
      "title": "Registration Confirmed",
      "message": "You have successfully registered for \"Tech Fest 2024\". Event date: Wed Feb 15 2024",
      "isRead": false,
      "sentAt": "2024-02-01T10:30:00Z",
      "event": {
        "_id": "EVENT_ID_1",
        "title": "Tech Fest 2024",
        "eventDate": "2024-02-15T10:00:00Z",
        "department": "Computer Science"
      }
    },
    {
      "_id": "NOT_ID_2",
      "type": "event_reminder",
      "title": "Event Reminder: Tech Fest 2024",
      "message": "Your registered event \"Tech Fest 2024\" is happening tomorrow at Central Auditorium, Building A. Don't miss it!",
      "isRead": false,
      "sentAt": "2024-02-14T10:00:00Z"
    }
  ]
}
```

---

### 21. Get Unread Count
```bash
GET http://localhost:5000/api/notifications/unread-count
Authorization: Bearer {STUDENT_TOKEN}
```

**Response (200)**:
```json
{
  "unreadCount": 3
}
```

---

### 22. Mark Notification as Read
```bash
PUT http://localhost:5000/api/notifications/{NOT_ID_1}/read
Authorization: Bearer {STUDENT_TOKEN}
```

**Response (200)**:
```json
{
  "message": "Marked as read",
  "notification": {
    "_id": "NOT_ID_1",
    "type": "registration_confirmed",
    "title": "Registration Confirmed",
    "isRead": true,
    ...
  }
}
```

---

### 23. Mark All Notifications as Read
```bash
PUT http://localhost:5000/api/notifications/read-all
Authorization: Bearer {STUDENT_TOKEN}
```

**Response (200)**:
```json
{
  "message": "All notifications marked as read"
}
```

---

### 24. Delete Notification
```bash
DELETE http://localhost:5000/api/notifications/{NOT_ID_1}
Authorization: Bearer {STUDENT_TOKEN}
```

**Response (200)**:
```json
{
  "message": "Notification deleted"
}
```

---

### 25. Send Event Reminders (Admin - Manual Trigger)
```bash
POST http://localhost:5000/api/notifications/send-reminders
Authorization: Bearer {ADMIN_TOKEN}
```

**Response (200)**:
```json
{
  "message": "Reminders sent successfully",
  "eventsProcessed": 3,
  "remindersSent": 150
}
```

---

### 26. Broadcast Notification (Admin)
```bash
POST http://localhost:5000/api/notifications/broadcast
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "title": "System Maintenance Notice",
  "message": "The system will be down for maintenance on Saturday 2024-02-17 from 2 AM to 6 AM. Plan your activities accordingly.",
  "type": "system_alert"
}
```

**Response (201)**:
```json
{
  "message": "Notifications broadcast successfully",
  "count": 2847
}
```

---

## 🏥 Health & Utility

### 27. Server Health Check
```bash
GET http://localhost:5000/api/health
```

**Response (200)**:
```json
{
  "message": "Server is running",
  "timestamp": "2024-02-01T15:30:45.123Z"
}
```

---

## 🔴 Error Scenarios

### Invalid Email Format
```bash
POST http://localhost:5000/api/auth/register

{
  "name": "John",
  "email": "invalidemail",
  "password": "pass"
}

Response (500):
{
  "message": "Server error"
}
```

---

### Trying to Register Twice
```bash
POST http://localhost:5000/api/registrations/register

{
  "eventId": "EVENT_ID_1"
}

Response (400):
{
  "message": "You are already registered for this event"
}
```

---

### Event Seats Full
```bash
POST http://localhost:5000/api/registrations/register

{
  "eventId": "FULL_EVENT"
}

Response (400):
{
  "message": "Event is full. No more seats available"
}
```

---

### Deadline Passed
```bash
POST http://localhost:5000/api/registrations/register

{
  "eventId": "EXPIRED_EVENT"
}

Response (400):
{
  "message": "Registration deadline has passed"
}
```

---

### Invalid Token
```bash
GET http://localhost:5000/api/notifications
Authorization: Bearer invalid_token

Response (401):
{
  "message": "Invalid token"
}
```

---

### Admin-Only Access
```bash
POST http://localhost:5000/api/events/create
Authorization: Bearer {STUDENT_TOKEN}

Response (403):
{
  "message": "Admin access only"
}
```

---

## 🎯 Testing Flow

**Recommended Order:**

1. ✅ Health Check (27)
2. ✅ Register Admin (1)
3. ✅ Register Students (2)
4. ✅ Login (3) - Save tokens
5. ✅ Create Events (4, 5)
6. ✅ View Events (6, 7, 8, 9)
7. ✅ Register for Events (11, 12)
8. ✅ View Registrations (13, 14, 15)
9. ✅ Check Notifications (20, 21)
10. ✅ Mark Attendance (17, 18, 19)
11. ✅ View Attendance (19)
12. ✅ Update Event (10)
13. ✅ Cancel Registration (16)

---

## 📊 Sample Data for Testing

### Coordinates for Testing:
- Event Location: 28.7041, 77.1025
- Valid Marking (within 150m): 28.7041, 77.1025
- Invalid Marking (outside): 28.7100, 77.1100

### Test Departments:
- Computer Science
- Physical Education
- Arts
- Engineering
- Commerce

---

## 🚀 Tips for Testing

1. Always save tokens from login responses
2. Use Bearer token in all protected routes
3. For geofencing tests, use coordinates within specified radius
4. Test both success and error cases
5. Monitor server logs for detailed errors
6. Test with admin and student accounts separately

---

**Happy Testing! 🎉**
