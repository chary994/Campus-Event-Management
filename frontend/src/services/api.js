import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const eventService = {
  getAllEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  getEventsByDepartment: (department) => api.get(`/events/department/${department}`),
  getEventLocation: (id) => api.get(`/events/${id}/location`),
  createEvent: (data) => api.post('/events/create', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  markAttendance: (eventId, data) => api.post(`/events/${eventId}/attendance`, data),
  getEventAttendance: (id) => api.get(`/events/${id}/attendance`),
};

export const registrationService = {
  registerForEvent: (eventId) => api.post(`/registrations/register/${eventId}`),
  cancelRegistration: (eventId) => api.post(`/registrations/cancel/${eventId}`),
  getMyRegistrations: () => api.get('/registrations/my-registrations'),
  getEventRegistrations: (eventId) => api.get(`/registrations/event/${eventId}`),
  checkRegistrationStatus: (eventId) => api.get(`/registrations/status/${eventId}`),
};

export const notificationService = {
  getMyNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

export const attendanceService = {
  markAttendance: (data) => api.post('/attendance/mark', data),
  getEventAttendance: (eventId) => api.get(`/attendance/${eventId}`),
  generateQRCode: (eventId) => api.get(`/attendance/qr/${eventId}`),
};

export const ratingService = {
  addRating: (data) => api.post('/ratings/add', data),
  getEventRatings: (eventId) => api.get(`/ratings/event/${eventId}`),
  getUserRating: (eventId) => api.get(`/ratings/event/${eventId}/user-rating`),
  deleteRating: (ratingId) => api.delete(`/ratings/${ratingId}`),
};

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export default api;
