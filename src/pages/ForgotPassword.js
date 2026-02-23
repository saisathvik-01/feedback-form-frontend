import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

/**
 * ForgotPassword Component - Password reset page (UI-only demo)
 */
function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = () => {
    if (!email.trim()) {
      setMessage('Please enter your email');
      setIsSuccess(false);
      return;
    }

    if (!email.includes('@')) {
      setMessage('Please enter a valid email address');
      setIsSuccess(false);
      return;
    }

    setMessage('Password reset link sent to ' + email + ' (Demo - No backend)');
    setIsSuccess(true);
    setEmail('');
  };

  const handleBackToLogin = () => {
    navigate('/');
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
                Forgot Password
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#999',
                }}
              >
                Enter your email to receive password reset instructions
              </Typography>
            </Box>

            {/* Success/Error Message */}
            {message && (
              <Alert severity={isSuccess ? 'success' : 'error'} sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            {/* Email Field */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />

            {/* Reset Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleReset}
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
              }}
            >
              Send Reset Link
            </Button>

            {/* Back to Login Link */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Remember your password?{' '}
                <Button
                  onClick={handleBackToLogin}
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
                  Back to Login
                </Button>
              </Typography>
            </Box>

            {/* Demo Notice */}
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
                  display: 'block',
                }}
              >
                Demo Mode
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#333' }}>
                This is a UI demo. No actual reset email will be sent.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default ForgotPassword;
