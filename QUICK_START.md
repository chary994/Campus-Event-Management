# 🚀 QUICK START GUIDE - Campus Event Management System

## ⚡ 5-Minute Quick Start

### Prerequisites
- Node.js installed ✅
- Backend running on port 5000 ✅
- Git (optional)

---

## Step 1: Install Frontend (2 minutes)

```bash
cd C:\CampusEventManagement\frontend
npm install
```

**Expected Output**:
```
added 147 packages in X seconds
```

---

## Step 2: Start Frontend (1 minute)

```bash
npm start
```

**Expected Output**:
```
webpack compiled
Compiled successfully!
On Your Network: http://xxx.xxx.x.xx:3000
Local:            http://localhost:3000
```

Browser will automatically open: **http://localhost:3000** ✅

---

## Step 3: Test the Application (2 minutes)

### Option A: Quick Test (Without Registration)

1. Click "Events" in navigation
2. Browse and filter events
3. Click on any event to view details
4. See event information (login required to register)

### Option B: Full Test (With Registration)

1. **Register**:
   - Click "Register" tab
   - Fill form: Name, Email, Password, Department, Role
   - Click "Register"

2. **Login**:
   - Email and Password you just created
   - Click "Login"

3. **Register for Event**:
   - Go to Events
   - Click event card
   - Click "Register Now"
   - Confirm

4. **View Registration**:
   - Click "My Registrations"
   - See your registered event

5. **Check Notifications**:
   - Click bell icon 🔔
   - View notifications

---

## 🎯 Test Accounts (Pre-created)

You can skip registration and use these:

### Admin Account
```
Email: admin@college.edu
Password: Admin@1234
```
**Permissions**: Create events, manage system

### Student Account 1
```
Email: student1@college.edu
Password: Pass@1234
```
**Permissions**: Register for events, view notifications

### Student Account 2
```
Email: student@college.edu
Password: Student@1234
```
**Permissions**: Register for events, view notifications

---

## 🖥️ System Status

### Backend ✅
- Status: Running
- Port: 5000
- Database: MongoDB Connected
- API: http://localhost:5000/api

### Frontend 📦
- Status: Ready
- Port: 3000
- URL: http://localhost:3000

---

## 📱 Features to Try

### 1. **Browse Events** (Unauthenticated)
- No login required
- View all events
- Filter by department
- Search events

### 2. **Register for Event** (Authenticated)
- Login/Register
- Click "Register Now" on any event
- See seat availability
- View registration confirmation

### 3. **Manage Registrations**
- Go to "My Registrations"
- View all your registered events
- Cancel registration anytime

### 4. **Notifications**
- Click 🔔 bell icon
- View event notifications
- Mark as read
- Delete old notifications

### 5. **Create Events** (Admin Only)
- Login with admin account
- Click "Create Event"
- Fill event form
- Event appears in listing

### 6. **Responsive Design**
- Open DevTools: F12
- Click mobile icon
- Test on different screen sizes

---

## 🎬 Complete User Journey (3 minutes)

```
1. START → http://localhost:3000
2. REGISTER → Fill form with your info
3. LOGIN → Use credentials you created
4. EXPLORE → Click "Events" to see all
5. FILTER → Search by department or keyword
6. SELECT → Click on event card
7. VIEW → See event details
8. REGISTER → Click "Register Now"
9. CONFIRM → Accept in dialog
10. CHECK → Go to "My Registrations"
11. NOTIFY → Check notifications
12. MANAGE → Cancel registration if needed
13. LOGOUT → Click profile → Logout
```

---

## 🐛 Troubleshooting (30 seconds)

### Frontend won't start
```bash
rm -r node_modules
npm install
npm start
```

### Port 3000 already in use
```bash
PORT=3001 npm start
```

### Backend not responding
```bash
cd C:\CampusEventManagement\backend
npm run dev
```

### Clear everything
```bash
# Close all terminals
# Ctrl+C to stop servers
# Delete node_modules in frontend
rm -r node_modules
npm install
npm start
```

---

## ✅ Success Checklist

When everything works, you should see:

- [ ] ✅ Frontend starts without errors
- [ ] ✅ Browser opens to http://localhost:3000
- [ ] ✅ Can see Events page without login
- [ ] ✅ Can register a new account
- [ ] ✅ Can login successfully
- [ ] ✅ Can view event details
- [ ] ✅ Can register for an event
- [ ] ✅ Can view my registrations
- [ ] ✅ Can see notifications
- [ ] ✅ Can logout

---

## 🎓 Learning Path

### Day 1: Exploration
- [x] Start frontend
- [x] Browse events
- [x] Create test accounts
- [x] Register for events

### Day 2: Deep Dive
- [ ] Create events (as admin)
- [ ] Test all filters
- [ ] Manage multiple registrations
- [ ] Explore all pages

### Day 3: Customization
- [ ] Change event titles
- [ ] Add more test data
- [ ] Test on mobile
- [ ] Review documentation

---

## 📚 Documentation

Quick Links to docs:
- **Setup**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Testing**: [FRONTEND_TESTING.md](./FRONTEND_TESTING.md)
- **Deployment**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Summary**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- **Backend API**: [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

---

## 🎉 You're All Set!

Your Campus Event Management System is ready to use! 

**Next Steps**:
1. ✅ Explore the frontend
2. ✅ Test with sample accounts
3. ✅ Create some events (as admin)
4. ✅ Register for events (as student)
5. ✅ Share with friends/colleagues

---

## 🆘 Need Help?

| Issue | Solution |
|-------|----------|
| Port in use | Use different port: `PORT=3001 npm start` |
| Can't connect to API | Check backend is running: `npm run dev` in backend folder |
| Blank page | Check browser console (F12) for errors |
| Slow loading | Wait 30 seconds, refresh page |
| Can't register | Check all fields are filled correctly |

---

## 📞 Quick Support

**Backend not running?**
```bash
cd C:\CampusEventManagement\backend
npm run dev
```

**Frontend not starting?**
```bash
cd C:\CampusEventManagement\frontend
npm install
npm start
```

**MongoDB issues?**
- Verify .env file has correct credentials
- Check IP whitelist in MongoDB Atlas
- Check internet connection

---

## 🎯 Common Commands

```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm start

# Install dependencies
npm install

# Build for production
npm run build

# Run tests
npm test

# View logs
npm logs
```

---

## 🌟 Pro Tips

1. **Use Test Accounts First**
   - Avoids registration form
   - Saves time in testing

2. **Open DevTools (F12)**
   - Helps debug issues
   - See API responses
   - Check console errors

3. **Test on Mobile**
   - DevTools → Mobile icon
   - Tests responsive design
   - Ensures phone compatibility

4. **Use Admin for Testing**
   - Can create events
   - Can see all registrations
   - Better for demos

5. **Keep Browser Tab Open**
   - Refresh with F5
   - Don't close to avoid losing auth
   - Check console for errors

---

## 🚀 Ready?

```
npm start
```

**That's it! Enjoy your Campus Event Management System! 🎉**

---

**System Ready Since**: January 20, 2026  
**Status**: ✅ PRODUCTION READY  
**Version**: 1.0.0 Complete

For detailed guides, see documentation files in project root.
