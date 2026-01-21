import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { eventService, attendanceService } from '../services/api';
import {
  Container,
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { format } from 'date-fns';

const AttendanceMarking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [distance, setDistance] = useState(null);
  const [geoError, setGeoError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventService.getEventById(id);
        setEvent(response.data);
      } catch (err) {
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const toRad = (val) => (val * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleMarkAttendance = async () => {
    setGeoError(null);
    setMarking(true);

    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      setMarking(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const dist = getDistanceInMeters(
            event.latitude,
            event.longitude,
            latitude,
            longitude
          );
          setDistance(dist);

          // Submit attendance
          const response = await attendanceService.markAttendance({
            eventId: id,
            latitude,
            longitude,
          });

          setSuccess(true);
          setTimeout(() => {
            navigate(`/events/${id}`);
          }, 2000);
        } catch (err) {
          setGeoError(
            err.response?.data?.message || 'Failed to mark attendance. Make sure you are at the event location.'
          );
        } finally {
          setMarking(false);
        }
      },
      (error) => {
        setGeoError(
          'Unable to get your location. Please enable location services and try again.'
        );
        setMarking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  if (!user || user.role === 'admin') {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">
          Only students can mark attendance.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!event) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Event not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
            📍 Mark Attendance
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              ✓ Attendance marked successfully!
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {geoError && (
            <Alert severity="error" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <ErrorIcon sx={{ mr: 1 }} />
              {geoError}
            </Alert>
          )}

          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Event Details
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Event:</strong> {event.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: '#2196F3', mt: 0.2 }} />
              <Box>
                <Typography variant="caption">
                  <strong>Location:</strong> {event.locationName}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: '#666' }}>
                  Geo-fence Radius: {event.radius}m
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2">
              <strong>Date:</strong> {format(new Date(event.eventDate), 'PPP p')}
            </Typography>
          </Paper>

          {distance !== null && (
            <Paper sx={{ p: 2, mb: 3, backgroundColor: '#e8f5e9', borderLeft: '4px solid #4CAF50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon sx={{ color: '#4CAF50', mr: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  Location Verified
                </Typography>
              </Box>
              <Typography variant="body2">
                Your distance from event: <strong>{Math.round(distance)}m</strong> (Allowed: {event.radius}m)
              </Typography>
            </Paper>
          )}

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleMarkAttendance}
            disabled={marking || success}
            sx={{
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#45a049' },
            }}
          >
            {marking ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Getting Location...
              </>
            ) : success ? (
              <>
                <CheckCircleIcon sx={{ mr: 1 }} />
                Attendance Marked
              </>
            ) : (
              'Mark Attendance'
            )}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate(`/events/${id}`)}
          >
            Back to Event
          </Button>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="caption">
              📌 <strong>Note:</strong> Your device location will be used to verify you are at the event venue.
              Make sure location services are enabled on your device.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AttendanceMarking;
