import React, { useContext } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const features = [
    {
      icon: '🎉',
      title: 'Explore Events',
      description: 'Discover amazing events happening across campus',
      action: () => navigate('/events'),
      showForRoles: ['student', 'admin'],
      color: '#6366F1',
    },
    {
      icon: '📋',
      title: 'My Registrations',
      description: 'View your registered events and details',
      action: () => navigate('/my-registrations'),
      showForRoles: ['student'],
      color: '#EC4899',
    },
    {
      icon: '🔔',
      title: 'Notifications',
      description: 'Get updates and reminders about events',
      action: () => navigate('/notifications'),
      showForRoles: ['student'],
      color: '#F59E0B',
    },
    {
      icon: '➕',
      title: 'Create Event',
      description: 'Organize and host new events',
      action: () => navigate('/events/create'),
      showForRoles: ['admin'],
      color: '#10B981',
    },
  ];

  const filteredFeatures = features.filter(feature => feature.showForRoles.includes(user?.role));

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bg: '#F8FAFC', pt: 8, pb: 8 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              color: '#1E293B',
              mb: 2,
              backgroundImage: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to Campus Events
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#64748B',
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Discover exciting events, connect with your community, and make memories
          </Typography>
        </Box>

        {/* Feature Cards Grid */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {filteredFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)',
                    borderColor: feature.color,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box
                    sx={{
                      fontSize: '60px',
                      mb: 3,
                      display: 'inline-block',
                      animation: 'float 3s ease-in-out infinite',
                      '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-10px)' },
                      },
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#1E293B',
                      mb: 1.5 
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748B', 
                      lineHeight: 1.7,
                      mb: 3
                    }}
                  >
                    {feature.description}
                  </Typography>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      color: feature.color,
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'transparent',
                      }
                    }}
                    onClick={feature.action}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Info Section */}
        <Card
          sx={{
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            color: 'white',
            p: 6,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            ✨ About Campus Events
          </Typography>
          <Typography sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
            Your all-in-one platform for discovering and managing college events. From technical 
            workshops to cultural celebrations, find events that match your interests, register 
            effortlessly, and never miss an update with our intelligent notification system.
          </Typography>
        </Card>
      </Container>
    </Box>
  );
};

export default Dashboard;
