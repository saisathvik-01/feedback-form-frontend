import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';

/**
 * Register Component - User registration page with role selection
 */
const Register = ({ onRegister }) => {
  const navigate = useNavigate();
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;
  const [registerData, setRegisterData] = useState({
    name: '',
    id: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    setError('');
    
    // Validate password on input
    if (name === 'password') {
      if (!passwordRegex.test(value)) {
        setPasswordError(
          'Password must be at least 6 characters, include 1 uppercase, 1 number, and 1 special character.'
        );
      } else {
        setPasswordError('');
      }
      // Also validate confirm password match when main password changes
      if (registerData.confirmPassword && value !== registerData.confirmPassword) {
        setConfirmError('Passwords do not match');
      } else if (registerData.confirmPassword) {
        setConfirmError('');
      }
    }
  };

  // Handle confirm password change
  const handleConfirmChange = (e) => {
    const value = e.target.value;
    setRegisterData((prev) => ({ ...prev, confirmPassword: value }));
    setError('');

    if (value !== registerData.password) {
      setConfirmError('Passwords do not match');
    } else {
      setConfirmError('');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!registerData.name.trim()) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    if (!registerData.id.trim()) {
      setError('Please enter your ID/Roll number');
      setLoading(false);
      return;
    }

    if (!registerData.email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(registerData.password)) {
      setError('Password must contain uppercase, number, and special character');
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Simulate registration
    setTimeout(() => {
      const success = onRegister(
        registerData.name,
        registerData.id,
        registerData.email,
        registerData.password,
        registerData.role
      );

      if (success) {
        // Redirect based on role
        navigate(registerData.role === 'STUDENT' ? '/student' : '/admin');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                }}
              >
                <PersonAddIcon sx={{ color: '#fff', fontSize: 32 }} />
              </Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: '#333',
                  mb: 1,
                }}
              >
                Create Account
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#999',
                }}
              >
                Register to access the feedback system
              </Typography>
            </Box>

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Registration Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Name Field */}
              <TextField
                fullWidth
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                value={registerData.name}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#999', mr: 1 }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* ID Field */}
              <TextField
                fullWidth
                name="id"
                label="Student/Faculty ID"
                placeholder="Enter your ID or Roll number"
                value={registerData.id}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon sx={{ color: '#999', mr: 1 }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Email Field */}
              <TextField
                fullWidth
                name="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={registerData.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#999', mr: 1 }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Role Selection */}
              <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                <InputLabel>Register as *</InputLabel>
                <Select
                  name="role"
                  value={registerData.role}
                  onChange={handleChange}
                  label="Register as *"
                >
                  <MenuItem value="STUDENT">Student</MenuItem>
                  <MenuItem value="FACULTY">Faculty</MenuItem>
                </Select>
              </FormControl>

              {/* Password Field */}
              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                value={registerData.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#999', mr: 1 }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Error Message */}
              {passwordError && (
                <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  {passwordError}
                </Typography>
              )}

              {/* Confirm Password Field */}
              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={registerData.confirmPassword}
                onChange={handleConfirmChange}
                margin="normal"
                variant="outlined"
                error={!!confirmError}
                helperText={confirmError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#999', mr: 1 }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Register Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  },
                  '&:disabled': {
                    opacity: 0.7,
                  },
                }}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </Box>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Already have an account?{' '}
                <Link
                  to="/"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Login here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
