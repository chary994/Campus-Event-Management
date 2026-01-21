import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { eventService, registrationService } from '../services/api';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import EventRating from '../components/EventRating';
import { format } from 'date-fns';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventService.getEventById(id);
        setEvent(response.data);

        // Check if user is registered
        if (user) {
          try {
            const regStatus = await registrationService.checkRegistrationStatus(id);
            setIsRegistered(regStatus.data.isRegistered);
          } catch (err) {
            setIsRegistered(false);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setRegistering(true);
      await registrationService.registerForEvent(id);
      setIsRegistered(true);
      setOpenDialog(false);
      alert('Successfully registered for the event!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancel = async () => {
    try {
      setRegistering(true);
      await registrationService.cancelRegistration(id);
      setIsRegistered(false);
      setOpenDialog(false);
      alert('Registration cancelled');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate('/events')} sx={{ mt: 2 }}>
          Back to Events
        </Button>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">Event not found</Alert>
        <Button onClick={() => navigate('/events')} sx={{ mt: 2 }}>
          Back to Events
        </Button>
      </Container>
    );
  }

  const registeredSeats = event.registeredCount || 0;
  const availableSeats = event.totalSeats - registeredSeats;
  const registrationPercentage = (registeredSeats / event.totalSeats) * 100;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => navigate('/events')} sx={{ mb: 2 }}>
        ← Back to Events
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EventIcon sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333' }}>
            {event.title}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Chip
            label={event.department}
            color="primary"
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Chip
            label={event.status}
            color={event.status === 'active' ? 'success' : 'default'}
            sx={{ mr: 1 }}
          />
        </Box>

        <Typography variant="body1" sx={{ mb: 4, color: '#555', lineHeight: 1.8 }}>
          {event.description}
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarTodayIcon sx={{ mr: 1, color: '#FF9800' }} />
                  <Typography variant="h6">Event Date</Typography>
                </Box>
                <Typography variant="body2">
                  {format(new Date(event.eventDate), 'PPP p')}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#999' }}>
                  Registration Deadline: {format(new Date(event.eventDeadline), 'PPP p')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ mr: 1, color: '#4CAF50' }} />
                  <Typography variant="h6">Registrations</Typography>
                </Box>
                <Typography variant="body2">
                  {registeredSeats} / {event.totalSeats} registered
                </Typography>
                <Box sx={{ width: '100%', height: 8, bgcolor: '#e0e0e0', borderRadius: 4, mt: 1 }}>
                  <Box
                    sx={{
                      width: `${registrationPercentage}%`,
                      height: '100%',
                      bgcolor: '#4CAF50',
                      borderRadius: 4,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#666', mt: 1 }}>
                  {availableSeats} seats available
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {event.location && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ mr: 1, color: '#F44336' }} />
                <Typography variant="h6">Location</Typography>
              </Box>
              <Typography variant="body2">
                Coordinates: {event.location.coordinates[1]}, {event.location.coordinates[0]}
              </Typography>
            </CardContent>
          </Card>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {user && user.role === 'admin' && (
            <>
              <Button
                variant="outlined"
                onClick={() => navigate(`/events/${id}/registrations`)}
              >
                View Registrations
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/events/${id}/attendance`)}
              >
                View Attendance
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/events/${id}/edit`)}
              >
                Edit Event
              </Button>
            </>
          )}
          {user && user.role !== 'admin' && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate(`/events/${id}/mark-attendance`)}
              >
                Mark Attendance
              </Button>
              {isRegistered ? (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setOpenDialog(true)}
                  disabled={registering}
                >
                  Cancel Registration
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setOpenDialog(true)}
                  disabled={registering}
                >
                  Register Now
                </Button>
              )}
            </>
          )}
        </Box>
      </Paper>

      {/* Ratings Section - Only for non-admin users */}
      {user?.role !== 'admin' && <EventRating eventId={id} />}

      <Dialog open={openDialog} onClose={() => !registering && setOpenDialog(false)}>
        <DialogTitle>
          {isRegistered ? 'Cancel Registration' : 'Confirm Registration'}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            {isRegistered
              ? 'Are you sure you want to cancel your registration for this event?'
              : `Are you sure you want to register for "${event.title}"?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={registering}>
            No, Go Back
          </Button>
          <Button
            onClick={isRegistered ? handleCancel : handleRegister}
            color={isRegistered ? 'error' : 'primary'}
            variant="contained"
            disabled={registering}
          >
            {registering ? <CircularProgress size={24} /> : 'Yes, Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetails;
