import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { eventService, registrationService } from '../services/api';
import {
  Container,
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import { format } from 'date-fns';

const EventRegistrations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/events');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const eventRes = await eventService.getEventById(id);
        setEvent(eventRes.data);

        const regRes = await registrationService.getEventRegistrations(id);
        if (regRes.data && regRes.data.registrations) {
          setRegistrations(regRes.data.registrations);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button onClick={() => navigate('/events')} sx={{ mb: 3 }}>
        ← Back to Events
      </Button>

      {event && (
        <>
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
              <EventIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {event.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {event.description?.substring(0, 100)}...
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon sx={{ fontSize: 32, color: '#2196F3', mr: 1 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Seats
                      </Typography>
                      <Typography variant="h6">{event.totalSeats}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon sx={{ fontSize: 32, color: '#4CAF50', mr: 1 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Registered
                      </Typography>
                      <Typography variant="h6">{registrations.length}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon sx={{ fontSize: 32, color: '#FF9800', mr: 1 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Available
                      </Typography>
                      <Typography variant="h6">{event.totalSeats - registrations.length}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#F44336' }}>
                      {((registrations.length / event.totalSeats) * 100).toFixed(0)}%
                    </Typography>
                    <Typography color="textSecondary" sx={{ ml: 1 }}>
                      Full
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table sx={{ minWidth: 700 }}>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>S.No</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Student Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Registered Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registrations.length > 0 ? (
                    registrations.map((registration, index) => (
                      <TableRow
                        key={registration._id}
                        sx={{
                          '&:hover': { backgroundColor: '#f9f9f9' },
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell sx={{ fontWeight: '500' }}>
                          {registration.student?.name || 'N/A'}
                        </TableCell>
                        <TableCell>{registration.student?.email || 'N/A'}</TableCell>
                        <TableCell>
                          {registration.registeredAt
                            ? format(new Date(registration.registeredAt), 'dd/MM/yyyy HH:mm')
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={registration.registrationStatus || 'Registered'}
                            color={registration.registrationStatus === 'registered' ? 'success' : 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography color="textSecondary">
                          No registrations yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default EventRegistrations;
