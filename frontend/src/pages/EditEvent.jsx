import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { eventService } from '../services/api';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventDeadline: '',
    totalSeats: 100,
    department: 'CSE',
    locationName: '',
    latitude: 40.7128,
    longitude: -74.006,
    radius: 5000,
  });

  const departments = ['CSE', 'ECE', 'Mechanical', 'Civil', 'EEE', 'IT', 'Chemical'];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventService.getEventById(id);
        const event = response.data;
        
        setFormData({
          title: event.title,
          description: event.description,
          eventDate: event.eventDate?.substring(0, 16) || '',
          eventDeadline: event.eventDeadline?.substring(0, 16) || '',
          totalSeats: event.totalSeats,
          department: event.department,
          locationName: event.locationName,
          latitude: event.latitude,
          longitude: event.longitude,
          radius: event.radius,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (user?.role !== 'admin') {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">You don't have permission to edit events</Alert>
        <Button onClick={() => navigate('/events')} sx={{ mt: 2 }}>
          Back to Events
        </Button>
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalSeats' || name === 'radius' ? parseInt(value) || 0 : 
              name === 'latitude' || name === 'longitude' ? parseFloat(value) || 0 : value,
    }));
    // Clear error when user starts filling the form
    if (error) setError(null);
  };

  const validateForm = () => {
    const title = formData.title ? formData.title.toString().trim() : '';
    const description = formData.description ? formData.description.toString().trim() : '';
    const eventDate = formData.eventDate ? formData.eventDate.toString().trim() : '';
    const eventDeadline = formData.eventDeadline ? formData.eventDeadline.toString().trim() : '';
    const locationName = formData.locationName ? formData.locationName.toString().trim() : '';
    const totalSeats = formData.totalSeats;

    if (!title) return 'Event Title is required';
    if (!description) return 'Description is required';
    if (!eventDate) return 'Event Date is required';
    if (!eventDeadline) return 'Registration Deadline is required';
    if (!locationName) return 'Location Name is required';
    if (!totalSeats || totalSeats <= 0) return 'Total Seats must be greater than 0';
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      console.log('Validation failed:', validationError);
      console.log('Form data:', formData);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        locationName: formData.locationName.trim(),
        eventDate: formData.eventDate,
        eventDeadline: formData.eventDeadline,
        totalSeats: parseInt(formData.totalSeats),
        department: formData.department,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        radius: parseInt(formData.radius),
      };
      console.log('Submitting:', payload);
      await eventService.updateEvent(id, payload);
      alert('Event updated successfully!');
      navigate(`/events/${id}`);
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err.response?.data?.message || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => navigate(`/events/${id}`)} sx={{ mb: 2 }}>
        ← Back to Event
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EventIcon sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
            Edit Event
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                variant="outlined"
                placeholder="e.g., Tech Fest 2026"
                required
                error={error && !formData.title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
                placeholder="Describe your event..."
                required
                error={error && !formData.description}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location Name"
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                variant="outlined"
                placeholder="e.g., Main Auditorium, Conference Hall"
                required
                error={error && !formData.locationName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Event Date & Time"
                name="eventDate"
                type="datetime-local"
                value={formData.eventDate}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required
                error={error && !formData.eventDate}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Registration Deadline"
                name="eventDeadline"
                type="datetime-local"
                value={formData.eventDeadline}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required
                error={error && !formData.eventDeadline}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Latitude"
                name="latitude"
                type="number"
                value={formData.latitude}
                onChange={handleChange}
                variant="outlined"
                inputProps={{ step: '0.0001' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Longitude"
                name="longitude"
                type="number"
                value={formData.longitude}
                onChange={handleChange}
                variant="outlined"
                inputProps={{ step: '0.0001' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Seats"
                name="totalSeats"
                type="number"
                value={formData.totalSeats}
                onChange={handleChange}
                variant="outlined"
                inputProps={{ min: 1 }}
                required
                error={error && formData.totalSeats <= 0}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                variant="outlined"
                SelectProps={{ native: true }}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Geo-fence Radius (meters)"
                name="radius"
                type="number"
                value={formData.radius}
                onChange={handleChange}
                variant="outlined"
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
            <Button onClick={() => navigate(`/events/${id}`)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={saving}>
              {saving ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditEvent;
