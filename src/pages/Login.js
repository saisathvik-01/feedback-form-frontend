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
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';

/**
 * Login Component - User authentication with role selection
 */
const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!loginData.email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    // Simulate login
    setTimeout(() => {
      const success = onLogin(
        loginData.email,
        loginData.password,
        loginData.role,
        loginData.email.split('@')[0],
        '12345'
      );

      if (success) {
        // Redirect based on role
        navigate(loginData.role === 'STUDENT' ? '/student' : '/admin');
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
      }}
    >
      <Container maxWidth="xs">
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
                <LockIcon sx={{ color: '#fff', fontSize: 30 }} />
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
                Welcome Back
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#999',
                }}
              >
                Sign in to access the feedback system
              </Typography>
            </Box>

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Email Field */}
              <TextField
                fullWidth
                name="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={loginData.email}
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
                <InputLabel>Login as</InputLabel>
                <Select
                  name="role"
                  value={loginData.role}
                  onChange={handleChange}
                  label="Login as"
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
                placeholder="Enter your password"
                value={loginData.password}
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

              {/* Login Button */}
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
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>

            {/* Registration Link */}
            <Box sx={{ textAlign: 'center', mt: 2, mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Register here
                </Link>
              </Typography>
            </Box>

            {/* Forgot Password Link */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                <Button
                  onClick={() => navigate('/forgot-password')}
                  sx={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 600,
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot Password?
                </Button>
              </Typography>
            </Box>

            {/* Demo Credentials */}
            <Box
              sx={{
                mt: 3,
                p: 2,
                background: '#f5f5f5',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#999',
                  fontWeight: 600,
                }}
              >
                Demo Credentials:
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#333' }}>
                <strong>Student:</strong> student@example.com / demo123
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#333' }}>
                <strong>Faculty:</strong> faculty@example.com / demo123
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
