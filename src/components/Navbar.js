import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

/**
 * Navbar Component - Role-based navigation bar
 */
const Navbar = ({ auth, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Don't show navbar on login and register pages
  if (location.pathname === '/' || location.pathname === '/register') {
    return null;
  }

  // If auth object is missing or user is not logged in, hide navbar
  if (!auth || !auth.isLoggedIn) {
    return null;
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    handleMenuClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Get user initials
  const initials = auth?.name
    ? auth.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : '';

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo and Title */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 4 }}
            onClick={() => navigate(auth?.role === 'STUDENT' ? '/student' : '/admin')}
          >
            <FeedbackIcon sx={{ fontSize: 32, mr: 1.5 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.2rem',
                letterSpacing: 0.5,
              }}
            >
              Feedback System
            </Typography>
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', gap: 1, ml: 'auto', mr: 2 }}>
            {auth.role === 'STUDENT' ? (
              <>
                <Button
                  color="inherit"
                  onClick={() => handleNavigation('/student')}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  onClick={() => handleNavigation('/form')}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Submit Feedback
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => handleNavigation('/admin')}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  onClick={() => handleNavigation('/create')}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Create Form
                </Button>
                <Button
                  color="inherit"
                  onClick={() => handleNavigation('/analytics')}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Analytics
                </Button>
              </>
            )}
          </Box>

          {/* User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {auth?.name || 'User'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {auth?.role === 'STUDENT' ? 'Student' : 'Faculty'}
              </Typography>
            </Box>
            <Avatar
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                fontWeight: 700,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                },
              }}
              onClick={handleMenuOpen}
            >
              {initials}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>
                <AccountCircleIcon sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {auth?.name || 'User'}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <AccountCircleIcon sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
