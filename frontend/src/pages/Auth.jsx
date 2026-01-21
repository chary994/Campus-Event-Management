import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'CSE',
  });
  const [errors, setErrors] = useState({});
  const { login, register, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const departments = ['CSE', 'ECE', 'Mechanical', 'Civil', 'EEE', 'IT', 'Chemical'];
  const roles = ['student', 'admin', 'coordinator'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!isLogin && !formData.name) newErrors.name = 'Name is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '', role: 'student', department: 'CSE' });
        alert('Registration successful! Please login.');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="auth-container" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <EventIcon sx={{ fontSize: 50, color: 'white' }} />
        </Box>
        <Typography variant="h3" align="center" sx={{ mb: 1, fontWeight: 'bold', color: 'white' }}>
          Campus Events
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)' }}>
          Discover and manage college events
        </Typography>

        <Paper elevation={8} sx={{ p: 4, borderRadius: 3, backgroundColor: '#FFFFFF' }}>
          <Tabs
            value={isLogin ? 0 : 1}
            onChange={(e, newValue) => {
              setIsLogin(newValue === 0);
              setErrors({});
            }}
            sx={{ 
              mb: 3,
              '& .MuiTabs-indicator': {
                backgroundColor: '#6366F1',
                height: 3,
              },
              '& .MuiTab-root': {
                color: '#64748B',
                fontWeight: 600,
                '&.Mui-selected': {
                  color: '#6366F1',
                }
              }
            }}
          >
            <Tab label="Login" sx={{ flex: 1 }} />
            <Tab label="Register" sx={{ flex: 1 }} />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                error={!!errors.name}
                helperText={errors.name}
                variant="outlined"
                placeholder="Enter your full name"
              />
            )}

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
              placeholder="your.email@college.edu"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
              placeholder="Enter your password"
            />

            {!isLogin && (
              <>
                <TextField
                  select
                  fullWidth
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  SelectProps={{ native: true }}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  SelectProps={{ native: true }}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </TextField>
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                py: 1.5, 
                fontSize: '16px', 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : isLogin ? 'Login' : 'Register'}
            </Button>
          </form>
        </Paper>

        <Typography align="center" sx={{ mt: 3, color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: '#FCD34D', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </Typography>
      </Container>
    </div>
  );
};

export default Auth;
