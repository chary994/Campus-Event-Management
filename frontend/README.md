# Campus Event Management - Frontend

A modern, attractive, and user-friendly React-based frontend for the Campus Event Management System.

## Features

### 🎯 Core Features
- **User Authentication**: Secure login and registration system
- **Event Discovery**: Browse and filter events by department, search, and status
- **Event Details**: View comprehensive event information with location and availability
- **Event Registration**: Register/cancel registrations with seat availability tracking
- **My Registrations**: View all registered events with quick actions
- **Notifications**: Real-time notifications for event reminders and announcements
- **Admin Panel**: Create and manage events (admin users only)

### 🎨 UI/UX Features
- **Responsive Design**: Fully responsive on mobile, tablet, and desktop
- **Modern Material Design**: Uses Material-UI for consistent, professional styling
- **Smooth Animations**: Elegant transitions and hover effects
- **Intuitive Navigation**: Easy-to-use menu and routing
- **Real-time Updates**: Live notification badges with unread count
- **Visual Feedback**: Loading states, error alerts, and success messages

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Navigate to the frontend directory:
```bash
cd C:\CampusEventManagement\frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with user menu
│   │   └── PrivateRoute.jsx     # Protected routes component
│   ├── context/
│   │   └── AuthContext.js       # Authentication context
│   ├── pages/
│   │   ├── Auth.jsx             # Login/Register page
│   │   ├── Dashboard.jsx        # Home page with features
│   │   ├── Events.jsx           # Events listing page
│   │   ├── EventDetails.jsx     # Event detail page
│   │   ├── CreateEvent.jsx      # Create event page (admin)
│   │   ├── MyRegistrations.jsx  # My registrations page
│   │   ├── Notifications.jsx    # Notifications page
│   │   ├── Auth.css
│   │   └── Events.css
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── App.jsx                  # Main app component
│   ├── index.js                 # React entry point
│   └── index.css                # Global styles
└── package.json
```

## Available Scripts

### `npm start`
Runs the app in development mode at http://localhost:3000

### `npm build`
Builds the app for production in the build folder

### `npm test`
Launches the test runner in interactive watch mode

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api`

### Endpoints Used:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events/create` - Create event (admin)
- `POST /api/registrations/register/:eventId` - Register for event
- `POST /api/registrations/cancel/:eventId` - Cancel registration
- `GET /api/registrations/my-registrations` - Get user registrations
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## Pages Overview

### 1. **Authentication** (`/login`)
- Login and Registration tabs
- Form validation with error messages
- Department and role selection for registration
- Persistent token storage

### 2. **Dashboard** (`/`)
- Welcome message with system overview
- Quick navigation to main features
- System information card

### 3. **Events** (`/events`)
- Grid view of all events
- Search functionality
- Department filtering
- Event cards with key information
- Progress bar showing registration status
- Navigation to event details

### 4. **Event Details** (`/events/:id`)
- Complete event information
- Location details
- Registration progress and available seats
- Registration/cancellation dialog
- Admin edit option

### 5. **Create Event** (`/events/create`)
- Event creation form (admin only)
- Fields: title, description, date, deadline, seats, department
- Validation and error handling
- Success feedback

### 6. **My Registrations** (`/my-registrations`)
- List of registered events
- Event details and registration date
- Quick navigation to event details
- Status indicators

### 7. **Notifications** (`/notifications`)
- List of all notifications
- Unread count badge
- Mark as read functionality
- Delete notifications
- Mark all as read option

## Styling & Themes

The app uses Material-UI with a custom theme:
- **Primary Color**: #2196F3 (Blue)
- **Secondary Color**: #667eea (Purple)
- **Success Color**: #4CAF50 (Green)
- **Error Color**: #F44336 (Red)

## Authentication Flow

1. User registers/logs in
2. JWT token received from backend
3. Token stored in localStorage
4. Token added to all API requests automatically
5. Automatic logout on 401 responses
6. Protected routes redirect to login

## Future Enhancements

- Geofencing integration for attendance marking
- Map view for event locations
- User profile page
- Event filtering by date range
- Social sharing features
- Event recommendations
- Push notifications
- Offline mode

## Technologies Used

- **React** - Frontend framework
- **React Router** - Navigation and routing
- **Material-UI** - Component library
- **Axios** - HTTP client
- **Context API** - State management
- **date-fns** - Date manipulation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please contact the development team.
