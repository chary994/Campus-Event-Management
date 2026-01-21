import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { notificationService } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUnreadCount = async () => {
        try {
          const response = await notificationService.getUnreadCount();
          setUnreadCount(response.data.unreadCount);
        } catch (err) {
          console.error('Failed to fetch unread count:', err);
        }
      };

      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfileOpen = (e) => setProfileAnchor(e.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  const handleLogout = () => {
    logout();
    handleProfileClose();
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', fontSize: '24px', color: 'white' }}
            >
              🎉 Campus Events
            </Typography>
          </Box>

          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => navigate('/events')}
                  sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                >
                  Events
                </Button>
                {user?.role !== 'admin' && (
                  <Button
                    color="inherit"
                    onClick={() => navigate('/my-registrations')}
                    sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  >
                    My Registrations
                  </Button>
                )}
                {user?.role === 'admin' && (
                  <Button
                    color="inherit"
                    onClick={() => navigate('/events/create')}
                    sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  >
                    Create Event
                  </Button>
                )}
              </Box>

              <IconButton
                color="inherit"
                onClick={() => navigate('/notifications')}
                sx={{ ml: 1, display: user?.role === 'admin' ? 'none' : 'flex' }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <IconButton color="inherit" onClick={toggleDarkMode} title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              <IconButton color="inherit" onClick={handleProfileOpen}>
                <AccountCircleIcon />
              </IconButton>

              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={handleProfileClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {user?.name}
                  </Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    {user?.role.toUpperCase()}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>

              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ display: { xs: 'block', sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { navigate('/events'); handleMenuClose(); }}>
                  Events
                </MenuItem>
                {user?.role !== 'admin' && (
                  <MenuItem onClick={() => { navigate('/my-registrations'); handleMenuClose(); }}>
                    My Registrations
                  </MenuItem>
                )}
                {user?.role === 'admin' && (
                  <MenuItem onClick={() => { navigate('/events/create'); handleMenuClose(); }}>
                    Create Event
                  </MenuItem>
                )}
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                variant="outlined"
                sx={{ borderColor: 'white' }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                variant="contained"
                sx={{ bgcolor: 'white', color: '#667eea' }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
