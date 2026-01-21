import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { registrationService } from '../services/api';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { format } from 'date-fns';

const MyRegistrations = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await registrationService.getMyRegistrations();
        setRegistrations(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (!user) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">Please login to view your registrations</Alert>
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
        📋 My Event Registrations
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {registrations.length === 0 ? (
        <Alert severity="info">
          You haven't registered for any events yet.
          <Button onClick={() => navigate('/events')} sx={{ ml: 2 }}>
            Browse Events
          </Button>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {registrations.map((reg) => (
            <Grid item xs={12} sm={6} md={4} key={reg.registrationId || reg._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ color: '#4CAF50', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {reg.event?.title || 'Untitled Event'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={reg.event?.department || 'N/A'}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Chip label="Registered" size="small" color="success" />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: '#FF9800' }} />
                      <Typography variant="caption">
                        {reg.event?.eventDate ? format(new Date(reg.event.eventDate), 'MMM dd, yyyy') : 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: '#2196F3' }} />
                      <Typography variant="caption">
                        {reg.event?.locationName || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Registered on: {reg.registeredAt ? format(new Date(reg.registeredAt), 'PPP') : 'N/A'}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/events/${reg.event?._id}`)}
                    fullWidth
                    disabled={!reg.event?._id}
                  >
                    View Event
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyRegistrations;
