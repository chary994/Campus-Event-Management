# Frontend Testing Guide

## Quick Start

### Prerequisites
- Backend running on port 5000 (✅ Already confirmed working)
- Node.js installed
- npm available

### Installation & Launch

```bash
# 1. Navigate to frontend
cd C:\CampusEventManagement\frontend

# 2. Install dependencies (first time only)
npm install

# 3. Start the development server
npm start
```

Your browser should automatically open to: **http://localhost:3000**

---

## User Interface Overview

### 🏠 Home Page (Dashboard)
When you first visit the app (logged out):
- Welcome message
- 4 feature cards (Explore Events, My Registrations, Notifications, Create Event)
- About section
- Links to login/register

### 🔐 Authentication

#### Registering a New Account
1. Click "Register" tab on Auth page
2. Fill in details:
   - **Name**: Your full name
   - **Email**: Your college email
   - **Password**: 6+ characters
   - **Department**: Select from dropdown (CSE, ECE, etc.)
   - **Role**: 
     - `student` - Can register for events
     - `admin` - Can create events and manage

#### Login
1. Enter your email and password
2. Click "Login"
3. Redirected to dashboard

---

## 🎯 Test Scenarios

### Scenario 1: Student Registration & Event Discovery

**User Account**:
- Email: `student1@college.edu`
- Password: `Pass@1234`
- Role: `student`
- Department: `CSE`

**Test Steps**:
1. Register with above credentials
2. You're logged in! See dashboard
3. Click "Events" in navbar
4. Browse events with filters (search, department)
5. Click on an event card
6. View event details:
   - Title, description
   - Date and deadline
   - Registration progress bar
   - Available seats
7. Click "Register Now"
8. Confirm registration in dialog
9. See "Register Now" button change to "Cancel Registration"
10. Go to "My Registrations" to view registered events

### Scenario 2: Admin Event Creation

**Admin Account**:
- Email: `admin@college.edu`
- Password: `Admin@1234`
- Role: `admin`

**Test Steps**:
1. Login with admin credentials
2. See "Create Event" button in navbar
3. Click "Create Event"
4. Fill event form:
   - **Title**: "Tech Fest 2026"
   - **Description**: "Annual technology festival with workshops and competitions"
   - **Event Date**: 2026-02-15 10:00
   - **Deadline**: 2026-02-10 23:59
   - **Total Seats**: 100
   - **Department**: CSE
5. Click "Create Event"
6. Success! Redirected to events list
7. See your new event in the list
8. View it and update registrations

### Scenario 3: Event Filtering & Search

**Test Steps**:
1. Go to Events page
2. **Search**: Type "Tech" to find tech-related events
3. **Department Filter**: Select "ECE" to see only ECE events
4. **Clear**: Switch back to "All Departments" and clear search
5. Try combining filters

### Scenario 4: Notifications

**Test Steps**:
1. Login as student
2. Click notification bell 🔔 in navbar
3. See notification badge with count
4. Click "Notifications" in navbar
5. View all notifications
6. Click notification to see details
7. Mark as read (envelope icon)
8. Mark all as read (button)
9. Delete notifications (trash icon)

### Scenario 5: Full User Journey

1. **Register as Student**:
   - Email: `john@college.edu`
   - Password: `John@1234`

2. **Navigate Dashboard**: Explore all feature cards

3. **Browse Events**: 
   - Search for events
   - Filter by department

4. **Register for Event**:
   - View event details
   - Register for 2-3 events
   - See seats filling up

5. **View My Registrations**:
   - See all registered events
   - Check registration dates

6. **Check Notifications**:
   - View any system notifications
   - Mark as read

7. **Logout**:
   - Click profile icon
   - Click "Logout"

---

## 🎨 UI Components to Test

### Navigation Bar
- ✅ Logo/Home navigation
- ✅ Menu links (Events, My Registrations, Notifications, Create Event)
- ✅ Notification badge updates
- ✅ User profile dropdown
- ✅ Mobile responsive menu
- ✅ Logout functionality

### Event Cards
- ✅ Event title and icon
- ✅ Department chip
- ✅ Status indicator
- ✅ Date display
- ✅ Registration progress bar
- ✅ "View Details" button
- ✅ Hover animation effects

### Forms
- ✅ Input validation
- ✅ Error messages
- ✅ Success alerts
- ✅ Loading states (spinners)
- ✅ Form reset on success

### Modals/Dialogs
- ✅ Registration confirmation
- ✅ Cancellation confirmation
- ✅ Error dialogs
- ✅ Success alerts

---

## 🔍 Testing Checklist

### Frontend Functionality
- [ ] User registration works
- [ ] User login works
- [ ] Login persistence (refresh page - still logged in)
- [ ] Event listing displays all events
- [ ] Event search filters correctly
- [ ] Department filter works
- [ ] Event details page loads
- [ ] Can register for event
- [ ] Can cancel registration
- [ ] My Registrations shows registered events
- [ ] Notifications display correctly
- [ ] Can mark notifications as read
- [ ] Can delete notifications
- [ ] Unread count updates
- [ ] Admin can create events
- [ ] Students cannot access create event page
- [ ] Logout works
- [ ] Protected routes redirect to login

### UI/UX
- [ ] Navigation is intuitive
- [ ] Buttons respond to clicks
- [ ] Forms validate input
- [ ] Loading indicators show
- [ ] Error messages are clear
- [ ] Success confirmations appear
- [ ] Layout is responsive
- [ ] Mobile view works well
- [ ] Animations are smooth
- [ ] Colors are consistent
- [ ] Text is readable
- [ ] Icons are clear

### API Integration
- [ ] Backend requests complete successfully
- [ ] Error handling displays properly
- [ ] Token authentication works
- [ ] Unauthorized access redirects to login
- [ ] Data displays correctly from API
- [ ] Form submissions post correctly

---

## 🐛 Debugging Tips

### Browser Console
Open DevTools: `F12` or `Ctrl+Shift+I`
- Check **Console** tab for JavaScript errors
- Check **Network** tab for API calls
- Verify backend responses

### Network Requests
1. Open DevTools → Network tab
2. Perform an action
3. See API calls to http://localhost:5000/api/*
4. Click request to see:
   - Request headers
   - Response data
   - Status code (200 = success, 401 = auth error, etc.)

### Local Storage
1. Open DevTools → Application/Storage tab
2. See stored:
   - `token` - JWT authentication token
   - `user` - Current user data

### Common Issues

**"Cannot connect to server"**
- Check backend is running: `npm run dev` in backend folder
- Check it's on port 5000
- Check MongoDB connection

**"Undefined is not a function"**
- Check browser console for specific error
- Refresh the page
- Clear cache: `Ctrl+Shift+Delete`

**"Token expired"**
- Logout and login again
- Clear localStorage and try again

---

## 📱 Responsive Design Testing

### Test on Different Screen Sizes

**Desktop** (1920x1080):
- Full navbar with all menu items
- Grid layout with 3-4 cards per row
- All features visible

**Tablet** (768x1024):
- Hamburger menu appears
- Grid with 2 cards per row
- Touch-friendly spacing

**Mobile** (375x812):
- Hamburger menu only
- Full-width single column
- Large touch targets
- Vertical scrolling

### Browser DevTools Responsive View
1. Press `F12`
2. Click device icon 📱
3. Select device type to test

---

## 🎬 Demo Data

Create test accounts and events:

### Test Accounts

**Student 1**:
```
Email: student1@college.edu
Password: Pass@1234
```

**Student 2**:
```
Email: student2@college.edu
Password: Pass@1234
```

**Admin**:
```
Email: admin@college.edu
Password: Admin@1234
```

### Create Test Events (as Admin)

1. Tech Fest 2026
   - Date: 2026-02-15
   - Seats: 100

2. Sports Day 2026
   - Date: 2026-02-20
   - Seats: 50

3. Hackathon 2026
   - Date: 2026-03-01
   - Seats: 75

---

## ✅ Success Indicators

You'll know everything is working when:

✅ Navbar displays with correct links  
✅ Can register and login  
✅ Events list displays  
✅ Can register for events  
✅ My Registrations shows registered events  
✅ Notifications display  
✅ Admin can create events  
✅ Logout clears authentication  
✅ Mobile layout works  
✅ All transitions are smooth  

---

## 📞 Troubleshooting

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm start
```

### npm install fails
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

### Dependencies not found
```bash
# Delete node_modules and package-lock.json
rm -r node_modules
rm package-lock.json
npm install
```

---

## 🎯 Test Completion

When you've successfully:
1. Registered multiple users
2. Created events (as admin)
3. Registered for events (as student)
4. Viewed registrations
5. Checked notifications
6. Tested responsive design
7. Logged out successfully

**Congratulations! Your Campus Event Management System is fully functional! 🎉**

---

For more information, see:
- [Frontend README](./frontend/README.md)
- [Backend Documentation](./backend/API_DOCUMENTATION.md)
- [System Architecture](./backend/ARCHITECTURE.md)
