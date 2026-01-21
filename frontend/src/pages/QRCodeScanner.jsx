import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { eventService, attendanceService } from '../services/api';
import QrScanner from 'qr-scanner';
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
  TextField,
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { format } from 'date-fns';

const QRCodeScanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const videoRef = useRef(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [marking, setMarking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [distance, setDistance] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [manualQR, setManualQR] = useState('');
  const qrScannerRef = useRef(null);

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

  const startScanning = async () => {
    try {
      setScanning(true);
      setError(null);
      
      if (videoRef.current) {
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          async (result) => {
            try {
              const qrData = result.data;
              setQrScanned(true);
              
              // Verify QR code contains eventId
              if (!qrData.includes(id)) {
                setError('Invalid QR code for this event');
                setQrScanned(false);
                return;
              }
              
              // Get GPS location
              getLocation(qrData);
            } catch (err) {
              setError('Failed to process QR code');
              setQrScanned(false);
            }
          },
          {
            maxScansPerSecond: 5,
          }
        );
        
        await qrScannerRef.current.start();
      }
    } catch (err) {
      setError('Camera access denied or not available');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setScanning(false);
  };

  const getLocation = (qrData) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const dist = getDistanceInMeters(
          event.latitude,
          event.longitude,
          latitude,
          longitude
        );
        setDistance(dist);

        // Mark attendance with QR code
        await markAttendance(qrData, latitude, longitude);
      },
      (err) => {
        setGeoError('Unable to get your location. Please enable location services.');
        setQrScanned(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const markAttendance = async (qrCode, latitude, longitude) => {
    setMarking(true);
    try {
      await attendanceService.markAttendance({
        eventId: id,
        latitude,
        longitude,
        qrCode,
      });

      setSuccess(true);
      stopScanning();
      setTimeout(() => {
        navigate(`/events/${id}`);
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to mark attendance. Please try again.'
      );
      setQrScanned(false);
    } finally {
      setMarking(false);
    }
  };

  const handleManualQRSubmit = async () => {
    if (!manualQR.trim()) {
      setError('Please enter or scan a QR code');
      return;
    }
    
    setMarking(true);
    getLocation(manualQR);
  };

  if (!user || user.role === 'admin') {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">
          Only students can scan QR codes for attendance.
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <QrCode2Icon sx={{ fontSize: 32, mr: 2, color: '#1976D2' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
              Scan QR Code
            </Typography>
          </Box>

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              ✓ Attendance marked successfully!
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <ErrorIcon sx={{ mr: 1 }} />
              {error}
            </Alert>
          )}

          {geoError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              📍 {geoError}
            </Alert>
          )}

          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Event Details
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Event:</strong> {event.title}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Date:</strong> {format(new Date(event.eventDate), 'PPP p')}
            </Typography>
            <Typography variant="body2">
              <strong>Location:</strong> {event.locationName}
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

          {!scanning && !success ? (
            <>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<CameraIcon />}
                onClick={startScanning}
                disabled={marking}
                sx={{
                  backgroundColor: '#1976D2',
                  '&:hover': { backgroundColor: '#1565C0' },
                  mb: 2,
                }}
              >
                Start Camera
              </Button>

              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', my: 2, color: '#666' }}>
                or
              </Typography>

              <TextField
                fullWidth
                label="Manual QR Code"
                placeholder="Paste QR code value here"
                value={manualQR}
                onChange={(e) => setManualQR(e.target.value)}
                disabled={marking}
                sx={{ mb: 2 }}
              />

              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={handleManualQRSubmit}
                disabled={marking || !manualQR.trim()}
              >
                {marking ? <CircularProgress size={20} sx={{ mr: 1 }} /> : ''}
                Submit
              </Button>
            </>
          ) : null}

          {scanning && !qrScanned && !success ? (
            <>
              <Box
                sx={{
                  width: '100%',
                  height: '300px',
                  backgroundColor: '#000',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  mb: 2,
                }}
              >
                <video
                  ref={videoRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={stopScanning}
                disabled={marking}
              >
                Stop Camera
              </Button>
            </>
          ) : null}

          {qrScanned || marking ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
                Processing attendance...
              </Typography>
            </Box>
          ) : null}

          <Button
            variant="text"
            fullWidth
            sx={{ mt: 3, color: '#1976D2' }}
            onClick={() => navigate(`/events/${id}`)}
            disabled={scanning}
          >
            Back to Event
          </Button>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="caption">
              📱 <strong>How it works:</strong> Click "Start Camera" and point your device at the QR code displayed at the event venue. Your location will be verified to ensure you are physically present.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
};

export default QRCodeScanner;
