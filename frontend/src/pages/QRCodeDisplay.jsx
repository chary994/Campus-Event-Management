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
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';

const QRCodeDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event details
        const eventRes = await eventService.getEventById(id);
        setEvent(eventRes.data);

        // Generate QR code
        const qrRes = await attendanceService.generateQRCode(id);
        setQrCode(qrRes.data.qrCode);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to generate QR code');
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
          Only admins can display QR codes.
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

  if (!event || !qrCode) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Failed to load QR code'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/events/${id}`)}
          sx={{ mt: 2 }}
        >
          Back to Event
        </Button>
      </Container>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${event.title}-qrcode.png`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Event QR Code - ${event.title}</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
            h1 { color: #333; margin-bottom: 10px; }
            p { color: #666; margin: 5px 0; }
            img { max-width: 400px; margin: 20px 0; }
            .footer { color: #999; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${event.title}</h1>
            <p><strong>Date:</strong> ${format(new Date(event.eventDate), 'PPP p')}</p>
            <p><strong>Location:</strong> ${event.locationName}</p>
            <img src="${qrCode}" alt="QR Code" />
            <p>Scan this QR code to mark attendance</p>
            <div class="footer">
              <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <QrCode2Icon sx={{ fontSize: 32, mr: 2, color: '#1976D2' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
              Attendance QR Code
            </Typography>
          </Box>

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

          <Paper sx={{ p: 3, mb: 3, textAlign: 'center', backgroundColor: '#fff' }}>
            <img
              src={qrCode}
              alt="QR Code"
              style={{
                width: '100%',
                maxWidth: '300px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                padding: '10px',
              }}
            />
          </Paper>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="caption">
              📱 <strong>Instructions:</strong> Display this QR code at the event. Students will scan it to mark attendance.
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleDownload}
            >
              Download QR Code
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={handlePrint}
            >
              Print QR Code
            </Button>
          </Box>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/events/${id}`)}
          >
            Back to Event
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default QRCodeDisplay;
