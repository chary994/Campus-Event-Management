import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider as CustomThemeProvider, ThemeContext } from './context/ThemeContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyRegistrations from './pages/MyRegistrations';
import Notifications from './pages/Notifications';
import EventRegistrations from './pages/EventRegistrations';
import AttendanceMarking from './pages/AttendanceMarking';
import AttendanceList from './pages/AttendanceList';

const getTheme = (isDarkMode) => createTheme({
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#EC4899',
      light: '#F472B6',
      dark: '#DB2777',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
    },
    background: {
      default: isDarkMode ? '#0F172A' : '#F8FAFC',
      paper: isDarkMode ? '#1E293B' : '#FFFFFF',
    },
    text: {
      primary: isDarkMode ? '#F1F5F9' : '#1E293B',
      secondary: isDarkMode ? '#94A3B8' : '#64748B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 20px',
          transition: 'all 0.3s ease',
        },
        contained: {
          boxShadow: '0 4px 6px rgba(99, 102, 241, 0.1)',
          '&:hover': {
            boxShadow: '0 10px 15px rgba(99, 102, 241, 0.2)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s ease',
            '&:hover fieldset': {
              borderColor: '#6366F1',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <Router>
      <CustomThemeProvider>
        <AppWithTheme />
      </CustomThemeProvider>
    </Router>
  );
}

function AppWithTheme() {
  const { isDarkMode } = useContext(ThemeContext);
  const theme = getTheme(isDarkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route
          path="/events/:id/registrations"
          element={
            <PrivateRoute>
              <EventRegistrations />
            </PrivateRoute>
          }
        />
        <Route
          path="/events/:id/edit"
          element={
            <PrivateRoute>
              <EditEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/events/create"
          element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-registrations"
          element={
            <PrivateRoute>
              <MyRegistrations />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />
        <Route
          path="/events/:id/mark-attendance"
          element={
            <PrivateRoute>
              <AttendanceMarking />
            </PrivateRoute>
          }
        />
        <Route
          path="/events/:id/attendance"
          element={
            <PrivateRoute>
              <AttendanceList />
            </PrivateRoute>
          }
        />
        <Route path="*" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
