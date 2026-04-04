import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

// Main Pages
import AdminDashboard from './pages/AdminDashboard';
import StudentFeedback from './pages/StudentFeedback';
import SubmittedFeedback from './pages/SubmittedFeedback';
import Analytics from './pages/Analytics';

function App() {
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const defaultTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', defaultTheme === 'dark');
    document.body.classList.toggle('dark', defaultTheme === 'dark');
  }, []);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <StudentFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submitted"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <SubmittedFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'FACULTY']}>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;