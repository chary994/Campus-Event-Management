# Campus Event Management System

A comprehensive college event management platform for managing events across all departments with features like geofencing-based attendance, smart notifications, and registration management.

## 🎯 Features

### Admin Features
- ✅ Create and manage events across departments
- ✅ Set registration deadlines and seat capacity
- ✅ View real-time registration status
- ✅ Monitor attendance with geofencing
- ✅ Send notifications and reminders
- ✅ View attendance reports
- ✅ Track capacity and available seats

### Student Features
- ✅ Browse events by department
- ✅ Register/cancel event registrations
- ✅ View registration history
- ✅ Mark attendance using geofencing
- ✅ Get event location details
- ✅ Receive smart notifications
- ✅ View remaining seats and deadlines

### System Features
- ✅ **Geofencing**: Haversine formula-based location verification
- ✅ **Smart Notifications**: Automatic reminders, confirmations, and alerts
- ✅ **Registration Management**: Seat tracking and deadline enforcement
- ✅ **Multi-Department Support**: Events organized by department
- ✅ **Scheduled Tasks**: Automated notification delivery
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Role-Based Access**: Admin and Student roles

---

## 🛠 Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Location Calculation**: Haversine Formula
- **Scheduling**: Node.js setInterval (can use node-cron)

---

## 📦 Project Structure

```
backend/
├── config/
│   └── db.js                          # MongoDB connection
├── controllers/
│   ├── authController.js              # Auth logic
│   ├── eventController.js             # Event management
│   ├── registrationController.js      # Registration logic
│   ├── notificationController.js      # Notification handling
│   └── attendanceController.js        # Attendance marking
├── models/
│   ├── User.js                        # User schema
│   ├── Event.js                       # Event schema
│   ├── Registration.js                # Registration schema
│   ├── Notification.js                # Notification schema
│   └── Attendance.js                  # Attendance schema
├── middleware/
│   ├── authMiddleware.js              # JWT verification
│   └── roleMiddleware.js              # Admin role check
├── routes/
│   ├── authRoutes.js                  # Auth endpoints
│   ├── eventRoutes.js                 # Event endpoints
│   ├── registrationRoutes.js          # Registration endpoints
│   ├── notificationRoutes.js          # Notification endpoints
│   └── attendanceRoutes.js            # Attendance endpoints
├── services/
│   └── notificationService.js         # Notification logic
├── .env.example                       # Environment template
├── server.js                          # Express app setup
├── package.json                       # Dependencies
└── API_DOCUMENTATION.md               # API reference
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd CampusEventManagement/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Update .env file**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campus-events
   JWT_SECRET=your_super_secret_key_here
   ENABLE_SCHEDULED_TASKS=true
   NODE_ENV=development
   ```

5. **Run the server**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

6. **Verify setup**
   ```bash
   curl http://localhost:5000/api/health
   ```

---

## 📚 API Usage Examples

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@college.edu",
    "password": "securepass123",
    "role": "student"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@college.edu",
    "password": "securepass123"
  }'
```

### 3. Create Event (Admin)
```bash
curl -X POST http://localhost:5000/api/events/create \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### 4. Register for Event (Student)
```bash
curl -X POST http://localhost:5000/api/registrations/register \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "EVENT_ID_HERE"
  }'
```

### 5. Mark Attendance (Geofencing)
```bash
curl -X POST http://localhost:5000/api/events/attendance/mark \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "EVENT_ID_HERE",
    "latitude": 28.7045,
    "longitude": 77.1030
  }'
```

### 6. Get Notifications
```bash
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer {TOKEN}"
```

---

## 🔐 Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer eyJhbGc...
```

**Token validity**: 24 hours

---

## 📍 Geofencing Mechanism

The system uses the **Haversine formula** to calculate distance between user location and event location:

```
distance = 2 * R * arcsin(sqrt(sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)))
```

Where:
- R = Earth's radius (6,371 km)
- φ = latitude
- λ = longitude
- Δ = difference

**Example**: If event radius = 100 meters, student can only mark attendance within 100m of event location.

---

## 🔔 Notification System

### Automatic Notifications (When enabled)

1. **Event Reminders** (24 hours before)
   - Sent to all registered students
   - Reminder message with event details

2. **Deadline Warnings** (Before deadline)
   - Sent to students who haven't registered
   - Encourages registration

3. **Capacity Alerts** (When seats low)
   - Sent to event creator
   - Alert when 90% capacity reached

4. **Registration Confirmations**
   - Sent immediately after registration
   - Confirms registration details

5. **Event Updates**
   - Sent when admin updates event
   - Notifies registered students

### Running Scheduled Tasks

Set in `.env`:
```env
ENABLE_SCHEDULED_TASKS=true
```

Tasks run automatically at:
- Every 1 hour: Event reminders & deadline warnings
- Every 24 hours: Old notification cleanup

---

## 📊 Data Models

### Event Registration Flow
```
Student → Browse Events → Register → Get Confirmation → Mark Attendance → Complete
```

### Attendance Verification Flow
```
Student Location → Haversine Calculation → Within Radius? → Mark Attendance → Success
```

### Notification Flow
```
Event Created → Notify All Students
             → Registration Deadline → Warn Non-Registered
             → 24h Before Event → Remind Registered
             → Event Time → Mark Attendance
```

---

## 🔧 Database Indexes

Recommended MongoDB indexes for performance:

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })

// Events
db.events.createIndex({ createdBy: 1 })
db.events.createIndex({ eventDate: 1 })
db.events.createIndex({ department: 1 })

// Registrations
db.registrations.createIndex({ student: 1, event: 1 }, { unique: true })
db.registrations.createIndex({ event: 1 })
db.registrations.createIndex({ registeredAt: 1 })

// Notifications
db.notifications.createIndex({ user: 1, isRead: 1 })
db.notifications.createIndex({ sentAt: 1 })

// Attendance
db.attendance.createIndex({ event: 1 })
db.attendance.createIndex({ student: 1, event: 1 }, { unique: true })
```

---

## 🐛 Troubleshooting

### Connection Issues
```
Error: connect ECONNREFUSED
Solution: Check MongoDB is running and MONGODB_URI is correct
```

### Invalid Token
```
Error: Invalid token
Solution: Ensure token is in correct format: "Bearer {token}"
```

### Outside Geofence
```
Error: Outside event geo-fence
Solution: Be within the event radius (check coordinates)
```

### Already Marked Attendance
```
Error: Attendance already marked for this event
Solution: Each student can only mark attendance once per event
```

---

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| MONGODB_URI | localhost:27017 | MongoDB connection string |
| JWT_SECRET | - | Secret key for JWT signing |
| ENABLE_SCHEDULED_TASKS | false | Enable automated notifications |
| NODE_ENV | development | Environment mode |

---

## 🚀 Deployment

### Heroku Deployment
```bash
heroku create your-app-name
git push heroku main
heroku config:set MONGODB_URI=your_mongodb_url
heroku config:set JWT_SECRET=your_secret_key
```

### Docker Deployment
```dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 📱 Frontend Integration

### Expected Response Formats

**Login Response**:
```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@college.edu",
    "role": "student"
  }
}
```

**Event List Response**:
```json
[
  {
    "_id": "event_id",
    "title": "Tech Fest",
    "department": "CS",
    "eventDate": "2024-02-15T10:00:00Z",
    "registeredCount": 150,
    "availableSeats": 350,
    "status": "upcoming"
  }
]
```

---

## 📞 Support

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

For issues:
1. Check error messages in server logs
2. Verify environment variables
3. Review API documentation
4. Check database connection

---

## 📄 License

ISC License - Feel free to use for educational purposes

---

## 👥 Contributors

- Sravani - Original Author

---

**Last Updated**: January 2026
