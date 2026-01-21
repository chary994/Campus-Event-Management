# Quick Reference Guide

## 🚀 Getting Started in 5 Minutes

### 1. Install & Run
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Test Server
```bash
curl http://localhost:5000/api/health
```

### 3. Get Started
- See [README.md](./README.md) for detailed setup
- See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for all endpoints
- See [API_TEST_EXAMPLES.md](./API_TEST_EXAMPLES.md) for request examples

---

## 📋 Core Models at a Glance

| Model | Purpose | Key Fields |
|-------|---------|-----------|
| **User** | Authentication | name, email, password, role |
| **Event** | Event info | title, department, location, dates, seats |
| **Registration** | Student signup | student, event, status |
| **Notification** | System alerts | user, type, title, message |
| **Attendance** | Mark presence | student, event, coordinates |

---

## 🔑 Key Endpoints

### Auth
```
POST   /api/auth/register          Register user
POST   /api/auth/login             Login & get token
```

### Events
```
POST   /api/events/create          Create event (admin)
GET    /api/events                 List all events
GET    /api/events/{id}            Get event details
PUT    /api/events/{id}            Update event (admin)
GET    /api/events/department/{x}  Get by department
GET    /api/events/location/{id}   Get location info
POST   /api/events/attendance/mark Mark attendance
GET    /api/events/attendance/{id} View attendance (admin)
```

### Registrations
```
POST   /api/registrations/register           Register for event
GET    /api/registrations/my-registrations   My registrations
GET    /api/registrations/status/{eventId}   Check if registered
DELETE /api/registrations/{id}               Cancel registration
GET    /api/registrations/event/{id}         View all (admin)
```

### Notifications
```
GET    /api/notifications                Get my notifications
GET    /api/notifications/unread-count   Unread count
GET    /api/notifications/{id}           Get single
PUT    /api/notifications/{id}/read      Mark as read
PUT    /api/notifications/read-all       Mark all as read
DELETE /api/notifications/{id}           Delete
POST   /api/notifications/send-reminders Send reminders (admin)
POST   /api/notifications/broadcast      Broadcast (admin)
```

---

## 🔒 Authentication

All protected endpoints need:
```
Authorization: Bearer {JWT_TOKEN}
```

Token obtained from login response (24h validity)

---

## 📍 Geofencing Details

**Haversine Formula** calculates distance between two points:
- Event location: latitude, longitude
- Student location: latitude, longitude
- If distance ≤ radius → ✅ Mark attendance
- If distance > radius → ❌ Reject with error

**Example Radii:**
- Indoor venue: 50-100m
- Outdoor ground: 100-200m
- Large campus event: 300-500m

---

## 🔔 Notification Types

| Type | Trigger | Recipients |
|------|---------|-----------|
| **event_reminder** | 24h before event | Registered students |
| **registration_confirmed** | On registration | Registered student |
| **event_update** | Admin updates event | Registered students |
| **system_alert** | Admin broadcast | All users |

---

## 🗄 Environment Variables

```env
PORT=5000                           # Server port
MONGODB_URI=mongodb://...           # MongoDB connection
JWT_SECRET=your_secret_key          # JWT signing key
ENABLE_SCHEDULED_TASKS=true         # Auto notifications
NODE_ENV=development                # Environment
```

---

## 📊 Database Indexes (Recommended)

```javascript
// Run in MongoDB
db.users.createIndex({ email: 1 }, { unique: true })
db.events.createIndex({ createdBy: 1 })
db.events.createIndex({ eventDate: 1 })
db.events.createIndex({ department: 1 })
db.registrations.createIndex({ student: 1, event: 1 }, { unique: true })
db.registrations.createIndex({ event: 1 })
db.notifications.createIndex({ user: 1, isRead: 1 })
db.attendance.createIndex({ event: 1 })
db.attendance.createIndex({ student: 1, event: 1 }, { unique: true })
```

---

## 🐛 Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `ECONNREFUSED` | MongoDB not running | Start MongoDB service |
| `Invalid token` | Bad/missing token | Include `Authorization: Bearer {token}` |
| `Outside geofence` | Too far from event | Move closer to event location |
| `Already marked` | Attendance done | Each student marks once per event |
| `Admin access only` | Student trying admin action | Login as admin account |
| `Registration deadline passed` | After deadline | Register before deadline |
| `Event is full` | All seats taken | Can't register when full |

---

## 📚 File Structure Quick Links

```
backend/
├── models/
│   ├── User.js              - User schema
│   ├── Event.js             - Event schema (updated)
│   ├── Registration.js      - NEW: Registration schema
│   ├── Notification.js      - NEW: Notification schema
│   └── Attendance.js        - Attendance schema
│
├── controllers/
│   ├── authController.js         - Login/Register
│   ├── eventController.js        - Events (updated)
│   ├── registrationController.js - NEW: Registrations
│   ├── notificationController.js - NEW: Notifications
│   └── attendanceController.js   - Attendance
│
├── routes/
│   ├── authRoutes.js             - Auth routes
│   ├── eventRoutes.js            - Event routes (updated)
│   ├── registrationRoutes.js     - NEW: Registration routes
│   ├── notificationRoutes.js     - NEW: Notification routes
│   └── attendanceRoutes.js       - Attendance routes
│
├── middleware/
│   ├── authMiddleware.js  - JWT verification
│   └── roleMiddleware.js  - Admin checking
│
├── services/
│   └── notificationService.js    - NEW: Notification logic
│
├── config/
│   └── db.js              - MongoDB connection
│
├── server.js              - Express setup (updated)
├── package.json           - Dependencies (updated)
├── .env.example           - Environment template
├── README.md              - Setup guide
├── API_DOCUMENTATION.md   - Full API reference
├── API_TEST_EXAMPLES.md   - Test requests
├── ARCHITECTURE.md        - System design
└── IMPLEMENTATION_SUMMARY.md - What was built
```

---

## ⚡ Performance Tips

1. **Use Indexes**: Create DB indexes for frequently queried fields
2. **Pagination**: Implement for large lists (GET endpoints)
3. **Caching**: Cache event list for 5-10 minutes
4. **Connection Pool**: MongoDB keeps connection pool active
5. **Error Logging**: Implement centralized error logging

---

## 🔄 User Flow Examples

### Admin Workflow
```
1. Admin registers with role "admin"
2. Admin logs in → gets JWT token
3. Admin creates event with location & seats
4. All students auto-notified of new event
5. Admin views registrations and attendance
6. Admin sends broadcast notifications
```

### Student Workflow
```
1. Student registers with role "student"
2. Student logs in → gets JWT token
3. Student browses events by department
4. Student registers for event (before deadline)
5. Gets confirmation notification
6. Goes to event location
7. Marks attendance using geofencing
8. Receives event reminder before date
```

---

## 🔐 Security Checklist

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens with 24h expiry
- ✅ Role-based access control
- ✅ Input validation on all routes
- ✅ Unique constraints on key fields
- ✅ Error messages don't leak data

---

## 📈 Scalability Considerations

For large deployments:

1. **Database Sharding**: Shard by department
2. **Caching Layer**: Redis for notifications
3. **Message Queue**: Bull/RabbitMQ for tasks
4. **CDN**: Serve static assets from CDN
5. **Load Balancing**: Nginx/HAProxy for requests
6. **Monitoring**: Prometheus + Grafana
7. **Logging**: ELK Stack

---

## 🎓 Learning Resources

- **Express.js**: [expressjs.com](https://expressjs.com)
- **MongoDB**: [mongodb.com](https://mongodb.com)
- **JWT**: [jwt.io](https://jwt.io)
- **Mongoose**: [mongoosejs.com](https://mongoosejs.com)
- **Haversine Formula**: [Wikipedia](https://en.wikipedia.org/wiki/Haversine_formula)

---

## 🆘 Need Help?

1. Check **API_DOCUMENTATION.md** for endpoint details
2. Check **API_TEST_EXAMPLES.md** for request examples
3. Review **README.md** for setup issues
4. Check **ARCHITECTURE.md** for system design
5. Review controller comments for business logic

---

## 📝 Useful Commands

```bash
# Development
npm run dev              # Start with nodemon

# Production
npm start                # Start normally

# Database
mongosh                  # Connect to MongoDB
show dbs                 # List databases
use campus-events        # Use database
db.events.find()         # Query events
db.createIndex(...)      # Create index

# Testing (with curl/Postman)
# See API_TEST_EXAMPLES.md for examples
```

---

## 🚀 Deployment Checklist

- [ ] Copy .env.example to .env
- [ ] Update MONGODB_URI in .env
- [ ] Generate strong JWT_SECRET
- [ ] Set ENABLE_SCHEDULED_TASKS=true
- [ ] Create MongoDB indexes
- [ ] Test all API endpoints
- [ ] Setup error logging
- [ ] Configure CORS origins
- [ ] Setup rate limiting
- [ ] Deploy to hosting service

---

## 💡 Pro Tips

1. **Save API responses**: Keep token from login for testing
2. **Use Postman**: Organize requests in collections
3. **Enable timestamps**: All models have createdAt/updatedAt
4. **Test both paths**: Success and error cases
5. **Monitor logs**: Check server console for detailed errors
6. **Use filtering**: Endpoints support sorting/filtering
7. **Rate limiting**: Consider implementing for production

---

## 📞 Support

- Issues? Check error message in response
- 401 errors? Token missing or invalid
- 403 errors? Not enough permissions
- 404 errors? Resource doesn't exist
- 500 errors? Check server logs

---

**Happy Coding! 🎉**

For detailed information, always refer to the complete documentation files.
