import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import FeedbackForm from './pages/FeedbackForm';
import AdminDashboard from './pages/AdminDashboard';
import CreateForm from './pages/CreateForm';
import Analytics from './pages/Analytics';

// Create custom MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f57c00',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

/**
 * App Component - Main application with authentication and role-based routing
 */
function App() {
  // Authentication state
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    role: null, // 'STUDENT' or 'FACULTY'
    name: '',
    email: '',
    id: '',
  });

  /**
   * Handle user login
   */
  const handleLogin = (email, password, role, name, id) => {
    // Simple validation
    if (!email || !password) {
      alert('Please fill in all fields');
      return false;
    }

    // Simulate login success
    console.log('Login attempt:', { email, role, name });
    setAuth({
      isLoggedIn: true,
      role: role,
      name: name || email.split('@')[0],
      email: email,
      id: id,
    });
    return true;
  };

  /**
   * Handle user registration
   */
  const handleRegister = (name, id, email, password, role) => {
    // Simple validation
    if (!name || !id || !email || !password || !role) {
      alert('Please fill in all fields');
      return false;
    }

    // Simulate registration success
    console.log('Registration successful:', { name, id, email, role });
    setAuth({
      isLoggedIn: true,
      role: role,
      name: name,
      email: email,
      id: id,
    });
    return true;
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    setAuth({
      isLoggedIn: false,
      role: null,
      name: '',
      email: '',
      id: '',
    });
  };

  /**
   * Protected Route Component
   */
  const ProtectedRoute = ({ component, requiredRole }) => {
    if (!auth.isLoggedIn) {
      return <Navigate to="/" replace />;
    }

    if (requiredRole && auth.role !== requiredRole) {
      return <Navigate to={auth.role === 'STUDENT' ? '/student' : '/admin'} replace />;
    }

    return component;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar auth={auth} onLogout={handleLogout} />
          <Box sx={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register onRegister={handleRegister} />} />

              {/* Protected Routes - Student */}
              <Route
                path="/student"
                element={<ProtectedRoute component={<StudentDashboard auth={auth} />} requiredRole="STUDENT" />}
              />
              <Route
                path="/form"
                element={<ProtectedRoute component={<FeedbackForm auth={auth} />} requiredRole="STUDENT" />}
              />

              {/* Protected Routes - Faculty */}
              <Route
                path="/admin"
                element={<ProtectedRoute component={<AdminDashboard auth={auth} />} requiredRole="FACULTY" />}
              />
              <Route
                path="/create"
                element={<ProtectedRoute component={<CreateForm auth={auth} />} requiredRole="FACULTY" />}
              />
              <Route
                path="/analytics"
                element={<ProtectedRoute component={<Analytics auth={auth} />} requiredRole="FACULTY" />}
              />

              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
