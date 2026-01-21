import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { notificationService } from '../services/api';
import {
  Container,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import EventIcon from '@mui/icons-material/Event';
import { format } from 'date-fns';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [notifResponse, countResponse] = await Promise.all([
          notificationService.getMyNotifications(),
          notificationService.getUnreadCount(),
        ]);
        
        // Handle both formats: direct array or object with notifications property
        const notificationsData = Array.isArray(notifResponse.data) 
          ? notifResponse.data 
          : notifResponse.data.notifications || [];
        
        setNotifications(notificationsData);
        setUnreadCount(countResponse.data.unreadCount || 0);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  if (!user) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">Please login to view notifications</Alert>
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
          {' '}Notifications
        </Typography>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleMarkAllAsRead}
            startIcon={<MarkEmailReadIcon />}
          >
            Mark All as Read
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {notifications.length === 0 ? (
        <Alert severity="info">No notifications yet</Alert>
      ) : (
        <List sx={{ bgcolor: 'white', borderRadius: 1 }}>
          {notifications.map((notification, index) => (
            <ListItem
              key={notification._id}
              sx={{
                bgcolor: notification.isRead ? 'transparent' : '#f0f7ff',
                borderBottom: index < notifications.length - 1 ? '1px solid #e0e0e0' : 'none',
                '&:hover': {
                  bgcolor: notification.isRead ? '#f9f9f9' : '#e8f4ff',
                },
              }}
            >
              <ListItemIcon>
                <EventIcon color={notification.isRead ? 'disabled' : 'primary'} />
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={notification.message}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: notification.isRead ? 'normal' : 'bold',
                  },
                }}
              />
              <Typography variant="caption" sx={{ mr: 2, color: '#999' }}>
                {notification.createdAt ? format(new Date(notification.createdAt), 'MMM dd, HH:mm') : format(new Date(notification.sentAt), 'MMM dd, HH:mm')}
              </Typography>
              {!notification.isRead && (
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => handleMarkAsRead(notification._id)}
                  title="Mark as read"
                >
                  <MarkEmailReadIcon />
                </IconButton>
              )}
              <IconButton
                edge="end"
                size="small"
                onClick={() => handleDelete(notification._id)}
                title="Delete"
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Notifications;
