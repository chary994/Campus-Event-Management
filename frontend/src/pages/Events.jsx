import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { eventService } from '../services/api';
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
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import { format } from 'date-fns';
import './Events.css';

const Events = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all'); // all, low (>80%), high (<50% available)
  const [sortBy, setSortBy] = useState('date'); // date, capacity, title

  const departments = ['all', 'CSE', 'ECE', 'Mechanical', 'Civil', 'EEE', 'IT', 'Chemical'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getAllEvents();
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter((event) => event.department === departmentFilter);
    }

    // Capacity filter
    if (capacityFilter === 'almost-full') {
      filtered = filtered.filter((event) => {
        const capacityPercent = (event.registeredCount / event.totalSeats) * 100;
        return capacityPercent >= 80;
      });
    } else if (capacityFilter === 'plenty') {
      filtered = filtered.filter((event) => {
        const capacityPercent = (event.registeredCount / event.totalSeats) * 100;
        return capacityPercent < 50;
      });
    }

    // Sorting
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    } else if (sortBy === 'capacity') {
      filtered.sort((a, b) => {
        const capacityA = (a.registeredCount / a.totalSeats) * 100;
        const capacityB = (b.registeredCount / b.totalSeats) * 100;
        return capacityB - capacityA; // Descending
      });
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredEvents(filtered);
  }, [searchTerm, departmentFilter, capacityFilter, sortBy, events]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: isDarkMode ? '#0F172A' : '#F8FAFC', py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: isDarkMode ? '#F1F5F9' : '#1E293B',
            }}
          >
            🎉 Discover Events
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: isDarkMode ? '#94A3B8' : '#64748B',
              fontWeight: 400,
              mb: 4
            }}
          >
            Explore exciting opportunities happening across campus
          </Typography>

          {/* Search & Filter */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="Search events by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#6366F1' }} />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? '#F1F5F9' : '#1E293B',
                    '& fieldset': {
                      borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                variant="outlined"
                SelectProps={{ native: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? '#F1F5F9' : '#1E293B',
                    '& fieldset': {
                      borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    },
                  },
                }}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Capacity"
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
                variant="outlined"
                SelectProps={{ native: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? '#F1F5F9' : '#1E293B',
                    '& fieldset': {
                      borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    },
                  },
                }}
              >
                <option value="all">All Events</option>
                <option value="plenty">Plenty of Seats (&lt; 50%)</option>
                <option value="almost-full">Almost Full (&gt;= 80%)</option>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                variant="outlined"
                SelectProps={{ native: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? '#F1F5F9' : '#1E293B',
                    '& fieldset': {
                      borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    },
                  },
                }}
              >
                <option value="date">Date (Earliest First)</option>
                <option value="capacity">Capacity (Fullest First)</option>
                <option value="title">Title (A-Z)</option>
              </TextField>
            </Grid>
          </Grid>

          {user && user.role === 'admin' && (
            <Button
              variant="contained"
              onClick={() => navigate('/events/create')}
              sx={{ 
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                px: 4,
                py: 1.2,
              }}
            >
              + Create New Event
            </Button>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {filteredEvents.length === 0 ? (
          <Alert severity="info">No events found. Try adjusting your filters.</Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)',
                      borderColor: '#6366F1',
                    },
                  }}
                >
                  {/* Color Top Bar */}
                  <Box
                    sx={{
                      height: 4,
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    }}
                  />

                  <CardContent sx={{ flex: 1 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: '#1E293B',
                        mb: 2
                      }}
                    >
                      {event.title}
                    </Typography>

                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#64748B', 
                        mb: 3, 
                        lineHeight: 1.6,
                        minHeight: '45px'
                      }}
                    >
                      {event.description.substring(0, 80)}...
                    </Typography>

                    <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={event.department}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip
                        label={event.status || 'upcoming'}
                        size="small"
                        color={event.status === 'upcoming' ? 'success' : 'default'}
                      />
                    </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: '#FF9800' }} />
                      <Typography variant="caption">
                        {format(new Date(event.eventDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon sx={{ fontSize: 16, mr: 1, color: '#4CAF50' }} />
                      <Typography variant="caption">
                        {event.registeredCount || 0} / {event.totalSeats} registered
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      height: 6,
                      bgcolor: '#e0e0e0',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${((event.registeredCount || 0) / event.totalSeats) * 100}%`,
                        height: '100%',
                        bgcolor: '#4CAF50',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ gap: 1 }}>
                  <Button
                    size="small"
                    onClick={() => navigate(`/events/${event._id}`)}
                    variant="contained"
                    fullWidth
                    color="primary"
                  >
                    View Details
                  </Button>
                  {user && user.role === 'admin' && (
                    <Button
                      size="small"
                      onClick={() => navigate(`/events/${event._id}/registrations`)}
                      variant="outlined"
                      color="secondary"
                      fullWidth
                    >
                      View Registrations
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      </Container>
    </Box>
  );
};

export default Events;
