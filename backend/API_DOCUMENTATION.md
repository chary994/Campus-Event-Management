# Campus Event Management System - Backend API Documentation

## System Overview

A comprehensive college event management platform with:
- **Admin Portal**: Event creation and management
- **Student Portal**: Event discovery, registration, and attendance
- **Geofencing**: Location-based attendance marking
- **Smart Notifications**: Automated reminders and alerts
- **Registration Management**: Seat capacity tracking
- **Multi-Department Support**: Events across all college departments

---

## Architecture

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Geolocation**: Haversine Formula for distance calculation

### Models

#### 1. **User Model**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "admin" | "student",
  timestamps: true
}
```

#### 2. **Event Model**
```javascript
{
  title: String,
  description: String,
  department: String,
  locationName: String,
  latitude: Number,
  longitude: Number,
  radius: Number (meters),
  eventDate: Date,
  eventDeadline: Date,
  totalSeats: Number,
  registeredCount: Number,
  status: "upcoming" | "ongoing" | "completed" | "cancelled",
  createdBy: ObjectId (User ref),
  timestamps: true
}
```

#### 3. **Registration Model**
```javascript
{
  student: ObjectId (User ref),
  event: ObjectId (Event ref),
  registrationStatus: "registered" | "attended" | "cancelled",
  registeredAt: Date,
  unique: [student, event]
}
```

#### 4. **Attendance Model**
```javascript
{
  student: ObjectId (User ref),
  event: ObjectId (Event ref),
  latitude: Number,
  longitude: Number,
  markedAt: Date
}
```

#### 5. **Notification Model**
```javascript
{
  user: ObjectId (User ref),
  event: ObjectId (Event ref),
  type: "event_reminder" | "registration_confirmed" | "event_update" | "system_alert",
  title: String,
  message: String,
  isRead: Boolean,
  sentAt: Date,
  scheduledFor: Date (optional),
  timestamps: true
}
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "secure_password",
  "role": "admin" | "student"
}

Response: 201
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@college.edu",
    "role": "admin"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@college.edu",
  "password": "secure_password"
}

Response: 200
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@college.edu",
    "role": "admin"
  }
}
```

---

### Event Routes (`/api/events`)

#### Create Event (Admin Only)
```
POST /api/events/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Tech Fest 2024",
  "description": "Annual technology festival",
  "department": "Computer Science",
  "locationName": "Central Auditorium",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "radius": 100,
  "eventDate": "2024-02-15T10:00:00Z",
  "eventDeadline": "2024-02-10T23:59:59Z",
  "totalSeats": 500
}

Response: 201
{
  "message": "Event created successfully",
  "event": { ... }
}
```

#### Get All Events
```
GET /api/events
Authorization: Bearer {token}

Response: 200
[
  {
    "_id": "...",
    "title": "Tech Fest 2024",
    "department": "Computer Science",
    "registeredCount": 150,
    "availableSeats": 350,
    "eventDate": "2024-02-15T10:00:00Z",
    "status": "upcoming",
    ...
  }
]
```

#### Get Event by ID
```
GET /api/events/{eventId}
Authorization: Bearer {token}

Response: 200
{
  "_id": "...",
  "title": "Tech Fest 2024",
  "description": "...",
  "registeredCount": 150,
  "availableSeats": 350,
  ...
}
```

#### Get Event Location
```
GET /api/events/location/{eventId}
Authorization: Bearer {token}

Response: 200
{
  "title": "Tech Fest 2024",
  "locationName": "Central Auditorium",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "radius": 100,
  "eventDate": "2024-02-15T10:00:00Z"
}
```

#### Get Events by Department
```
GET /api/events/department/{departmentName}
Authorization: Bearer {token}

Response: 200
[
  { ... },
  { ... }
]
```

#### Update Event (Admin Only)
```
PUT /api/events/{eventId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "totalSeats": 600,
  "status": "ongoing"
}

Response: 200
{
  "message": "Event updated successfully",
  "event": { ... }
}
```

#### Mark Attendance (Geofencing)
```
POST /api/events/attendance/mark
Authorization: Bearer {token}
Content-Type: application/json

{
  "eventId": "...",
  "latitude": 28.7045,
  "longitude": 77.1030
}

Response: 201
{
  "message": "Attendance marked successfully",
  "attendance": { ... }
}
```

#### Get Event Attendance (Admin Only)
```
GET /api/events/attendance/{eventId}
Authorization: Bearer {token}

Response: 200
{
  "eventTitle": "Tech Fest 2024",
  "totalRegistered": 150,
  "totalAttended": 145,
  "attendanceList": [
    {
      "student": { "name": "...", "email": "..." },
      "markedAt": "...",
      "latitude": "...",
      "longitude": "..."
    }
  ]
}
```

---

### Registration Routes (`/api/registrations`)

#### Register for Event
```
POST /api/registrations/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "eventId": "..."
}

Response: 201
{
  "message": "Successfully registered for event",
  "registration": { ... }
}
```

#### Get My Registrations
```
GET /api/registrations/my-registrations
Authorization: Bearer {token}

Response: 200
[
  {
    "registrationId": "...",
    "registrationStatus": "registered",
    "registeredAt": "2024-02-01T...",
    "event": {
      "title": "Tech Fest 2024",
      "eventDate": "2024-02-15T...",
      "registeredCount": 150,
      "availableSeats": 350
    }
  }
]
```

#### Check Registration Status
```
GET /api/registrations/status/{eventId}
Authorization: Bearer {token}

Response: 200
{
  "isRegistered": true,
  "registrationStatus": "registered",
  "registeredAt": "2024-02-01T..."
}
```

#### Cancel Registration
```
DELETE /api/registrations/{registrationId}
Authorization: Bearer {token}

Response: 200
{
  "message": "Registration cancelled successfully"
}
```

#### Get Event Registrations (Admin Only)
```
GET /api/registrations/event/{eventId}
Authorization: Bearer {token}

Response: 200
{
  "event": {
    "id": "...",
    "title": "Tech Fest 2024",
    "totalSeats": 500,
    "registeredCount": 150,
    "availableSeats": 350,
    "registrations": [
      {
        "student": { "name": "...", "email": "..." },
        "registrationStatus": "registered",
        "registeredAt": "..."
      }
    ]
  }
}
```

---

### Notification Routes (`/api/notifications`)

#### Get My Notifications
```
GET /api/notifications
Authorization: Bearer {token}

Response: 200
{
  "unreadCount": 5,
  "notifications": [
    {
      "_id": "...",
      "type": "event_reminder",
      "title": "Event Reminder: Tech Fest 2024",
      "message": "...",
      "isRead": false,
      "sentAt": "..."
    }
  ]
}
```

#### Get Unread Count
```
GET /api/notifications/unread-count
Authorization: Bearer {token}

Response: 200
{
  "unreadCount": 5
}
```

#### Mark Notification as Read
```
PUT /api/notifications/{notificationId}/read
Authorization: Bearer {token}

Response: 200
{
  "message": "Marked as read",
  "notification": { ... }
}
```

#### Mark All Notifications as Read
```
PUT /api/notifications/read-all
Authorization: Bearer {token}

Response: 200
{
  "message": "All notifications marked as read"
}
```

#### Delete Notification
```
DELETE /api/notifications/{notificationId}
Authorization: Bearer {token}

Response: 200
{
  "message": "Notification deleted"
}
```

#### Send Event Reminders (Admin Only)
```
POST /api/notifications/send-reminders
Authorization: Bearer {token}

Response: 200
{
  "message": "Reminders sent successfully",
  "eventsProcessed": 3,
  "remindersSent": 150
}
```

#### Broadcast Notification (Admin Only)
```
POST /api/notifications/broadcast
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "System Maintenance",
  "message": "The system will be down for maintenance...",
  "type": "system_alert"
}

Response: 201
{
  "message": "Notifications broadcast successfully",
  "count": 2500
}
```

---

### Attendance Routes (`/api/attendance`)

#### Mark Attendance
```
POST /api/attendance/mark
Authorization: Bearer {token}
Content-Type: application/json

{
  "eventId": "...",
  "latitude": 28.7045,
  "longitude": 77.1030
}

Response: 201
{
  "message": "Attendance marked successfully",
  "attendance": { ... }
}
```

#### Get Event Attendance (Admin Only)
```
GET /api/attendance/{eventId}
Authorization: Bearer {token}

Response: 200
[
  {
    "student": { "name": "...", "email": "..." },
    "markedAt": "...",
    "latitude": "...",
    "longitude": "..."
  }
]
```

---

## Features

### 1. **Geofencing-based Attendance**
- Uses Haversine formula to calculate distance
- Students can only mark attendance within the event radius
- Prevents unauthorized attendance marking

### 2. **Smart Notifications**
- **Event Reminders**: 24 hours before event
- **Deadline Warnings**: When registration deadline approaches
- **Registration Confirmations**: When student registers
- **Event Updates**: When admin updates event details
- **Capacity Alerts**: When seats are running low
- **System Alerts**: For broadcast messages

### 3. **Registration Management**
- Seat capacity tracking
- Deadline enforcement
- Duplicate registration prevention
- One-to-one unique constraint (student per event)

### 4. **Automated Scheduled Tasks**
When `ENABLE_SCHEDULED_TASKS=true`:
- Sends event reminders every 24 hours
- Sends deadline warnings before deadlines
- Sends capacity alerts to admins
- Cleans up old notifications (30+ days)

---

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm/yarn

### Steps

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT_SECRET
   ```

3. **Run Server**
   ```bash
   npm run dev  # With nodemon (development)
   npm start    # Production
   ```

4. **Server Health Check**
   ```bash
   GET http://localhost:5000/api/health
   ```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description"
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Server Error

---

## Authentication

All protected endpoints require:
```
Authorization: Bearer {JWT_TOKEN}
```

Token includes:
- User ID
- User Role (admin/student)
- Expiry (24 hours)

---

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (RBAC)
- Unique constraints on email & student-event registrations
- Input validation on all endpoints

---

## Deployment Considerations

1. **Environment Variables**: Update JWT_SECRET for production
2. **MongoDB Atlas**: Use cloud MongoDB for production
3. **CORS Settings**: Configure allowed origins
4. **Rate Limiting**: Consider implementing for production
5. **Logging**: Add comprehensive logging service
6. **Error Tracking**: Integrate Sentry or similar

---

## Future Enhancements

- Email notifications integration
- Push notifications (Firebase Cloud Messaging)
- Event categories and filters
- QR code based attendance
- Analytics dashboard for admins
- Payment integration for paid events
- Event feedback/ratings
- Calendar integration
- Mobile app native geofencing

---

## Support & Maintenance

For issues or questions, refer to the code comments in each controller and service file.
