import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { eventService, attendanceService } from '../services/api';
import {
  Container,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';

const AttendanceList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event details
        const eventRes = await eventService.getEventById(id);
        setEvent(eventRes.data);

        // Fetch attendance list
        const attendanceRes = await attendanceService.getEventAttendance(id);
        setAttendance(attendanceRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (!user || user.role !== 'admin') {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">
          Only admins can view attendance list.
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
            📋 Attendance for {event.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            📅 Event Date: {format(new Date(event.eventDate), 'PPP p')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            📍 Location: {event.locationName}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip
              icon={<CheckCircleIcon />}
              label={`Present: ${attendance.length}`}
              color="success"
              variant="outlined"
            />
            <Chip
              label={`Total Registered: ${event.registeredCount || 0}`}
              variant="outlined"
            />
            <Chip
              label={`Absent: ${Math.max(0, (event.registeredCount || 0) - attendance.length)}`}
              color="error"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {attendance.length === 0 ? (
        <Alert severity="info">
          No students have marked attendance yet.
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <PersonIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
                  Student Name
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Marked At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map((record, index) => (
                <TableRow key={record._id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ color: '#4CAF50', mr: 1, fontSize: 20 }} />
                      {record.student?.name || 'Unknown Student'}
                    </Box>
                  </TableCell>
                  <TableCell>{record.student?.email || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.student?.department || 'N/A'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {record.markedAt
                      ? format(new Date(record.markedAt), 'PPP p')
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Button
        variant="outlined"
        sx={{ mt: 3 }}
        onClick={() => navigate(`/events/${id}`)}
      >
        Back to Event
      </Button>
    </Container>
  );
};

export default AttendanceList;
