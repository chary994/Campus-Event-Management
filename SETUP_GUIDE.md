# Campus Event Management System - Complete Setup Guide

## Project Overview

A full-stack Campus Event Management System with:
- **Backend**: Node.js + Express + MongoDB (Running on port 5000)
- **Frontend**: React + Material-UI (Will run on port 3000)

---

## ✅ Backend Status (Already Running)

Your backend is already set up and running successfully:

```
✅ MongoDB connected
🚀 Server running on port 5000
✅ Scheduled notification tasks enabled
```

**Backend Location**: `C:\CampusEventManagement\backend`

---

## 🚀 Frontend Setup Instructions

### Step 1: Navigate to Frontend Directory
```bash
cd C:\CampusEventManagement\frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages:
- react
- react-router-dom
- @mui/material (Material-UI)
- axios
- date-fns
- And more...

**Estimated time**: 2-3 minutes

### Step 3: Start the Frontend Server
```bash
npm start
```

The frontend will automatically open in your browser at `http://localhost:3000`

---

## 📱 Using the Application

### 1. First Time Setup

**Create an Admin Account**:
1. Go to http://localhost:3000/login
2. Click on "Register" tab
3. Fill in the form:
   - Name: "Admin User"
   - Email: "admin@college.edu"
   - Password: "Admin@1234"
   - Department: CSE
   - Role: Admin
4. Click "Register"

**Create a Student Account**:
1. Go to Register tab again
2. Fill in:
   - Name: "John Student"
   - Email: "student@college.edu"
   - Password: "Student@1234"
   - Department: CSE
   - Role: Student
3. Click "Register"

### 2. Navigate the Application

#### As Admin:
- Go to "Create Event" to add new events
- View all events
- See registration statistics
- Send notifications

#### As Student:
- Browse all events in "Events" page
- Click "View Details" on any event
- Click "Register Now" to register
- View your registrations in "My Registrations"
- Check "Notifications" for event updates

---

## 🔗 API Endpoints

The frontend communicates with backend at: `http://localhost:5000/api`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events/create` - Create event (admin)
- `GET /api/events/department/:dept` - Get events by department

### Registrations
- `POST /api/registrations/register/:eventId` - Register for event
- `POST /api/registrations/cancel/:eventId` - Cancel registration
- `GET /api/registrations/my-registrations` - Get user's registrations
- `GET /api/registrations/status/:eventId` - Check if registered

### Notifications
- `GET /api/notifications` - Get all notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `GET /api/notifications/unread-count` - Get unread count

---

## 📁 Project Structure

```
CampusEventManagement/
├── backend/                          # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/                 # Business logic
│   ├── models/                      # Database schemas
│   ├── routes/                      # API endpoints
│   ├── services/                    # Reusable services
│   ├── middleware/                  # Auth & role middleware
│   ├── server.js                    # Entry point
│   ├── package.json
│   └── .env                         # Environment variables
│
└── frontend/                         # React Frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.js        # Authentication state
    │   ├── pages/
    │   │   ├── Auth.jsx              # Login/Register
    │   │   ├── Dashboard.jsx         # Home page
    │   │   ├── Events.jsx            # Events list
    │   │   ├── EventDetails.jsx      # Event detail
    │   │   ├── CreateEvent.jsx       # Create event (admin)
    │   │   ├── MyRegistrations.jsx   # My registrations
    │   │   └── Notifications.jsx     # Notifications
    │   ├── services/
    │   │   └── api.js                # API client
    │   ├── App.jsx                   # Main component
    │   ├── index.js                  # Entry point
    │   └── index.css                 # Global styles
    ├── package.json
    └── README.md
```

---

## 🎨 Features Implemented

### ✅ User Authentication
- Secure login/registration
- JWT token-based authentication
- Role-based access control (Student, Admin, Coordinator)
- Department selection
- Auto-logout on token expiry

### ✅ Event Management
- Create events (admin only)
- View all events
- Filter by department
- Search events
- View detailed event information
- Real-time seat availability
- Registration progress visualization

### ✅ Registration System
- Register for events
- Cancel registrations
- View all registrations
- Check registration status
- Seat capacity validation

### ✅ Notifications
- Real-time notification alerts
- Mark as read functionality
- Delete notifications
- Unread count badge
- Scheduled notification tasks

### ✅ Responsive Design
- Mobile-friendly interface
- Tablet optimization
- Desktop optimization
- Smooth animations and transitions
- Modern Material Design

---

## 🔧 Troubleshooting

### Frontend won't start
```bash
# Clear node modules and reinstall
rm -r node_modules
npm install
npm start
```

### Backend connection error
Ensure backend is running:
```bash
cd C:\CampusEventManagement\backend
npm run dev
```

### Port already in use
```bash
# Change frontend port
PORT=3001 npm start

# Or change backend port in .env
PORT=5001
npm run dev
```

### MongoDB connection issues
Check `.env` file in backend:
```
MONGODB_URI=mongodb+srv://Sravani:Campus1234@cluster0.o6tnv0h.mongodb.net/campus_event_db?retryWrites=true&w=majority&tls=true
```

---

## 📊 Testing the Application

### Test Account Credentials

**Admin Account**:
- Email: `admin@college.edu`
- Password: `Admin@1234`

**Student Account**:
- Email: `student@college.edu`
- Password: `Student@1234`

### Test User Journey

1. **Register** → Login Page
2. **Login** → Dashboard (if student)
3. **Browse Events** → Events listing with filters
4. **View Event** → Event details with registration
5. **Register** → See your registration in "My Registrations"
6. **Notifications** → Check event alerts and updates

---

## 🌐 Deployment Guide

### Preparing for Production

1. **Build Frontend**:
```bash
cd C:\CampusEventManagement\frontend
npm run build
```

2. **Update Backend .env**:
```env
NODE_ENV=production
JWT_SECRET=your-strong-secret-key-here
CORS_ORIGIN=https://yourdomain.com
```

3. **Deploy Options**:
- Vercel (Frontend)
- Netlify (Frontend)
- Heroku (Backend)
- AWS (Full stack)
- DigitalOcean (Full stack)

---

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
PORT=5000
JWT_SECRET=your_secret_key
ENABLE_SCHEDULED_TASKS=true
NODE_ENV=development
```

### Frontend (.env) - Optional
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎯 Next Steps

1. ✅ Start backend (if not running):
   ```bash
   cd C:\CampusEventManagement\backend
   npm run dev
   ```

2. Install frontend:
   ```bash
   cd C:\CampusEventManagement\frontend
   npm install
   ```

3. Start frontend:
   ```bash
   npm start
   ```

4. Access the app:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

---

## 📞 Support

For issues or questions:
1. Check the README files in each folder
2. Review API documentation in backend
3. Check browser console for errors
4. Verify backend is running on port 5000

---

## ✨ Enjoy Your Campus Event Management System!

Your full-stack application is now ready to use. The frontend provides an attractive, user-friendly interface to manage college events efficiently.

**Happy Event Management! 🎉**
