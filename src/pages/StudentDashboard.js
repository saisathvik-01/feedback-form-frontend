import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';

/**
 * StudentDashboard Component - Main student dashboard
 */
const StudentDashboard = ({ auth }) => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      id: 1,
      title: 'Submit Feedback',
      description: 'Share your feedback about recent courses and instructors',
      icon: <AssignmentIcon sx={{ fontSize: 48, color: '#1976d2' }} />,
      action: () => navigate('/form'),
      actionLabel: 'Go to Form',
      color: '#e3f2fd',
    },
    {
      id: 2,
      title: 'My Courses',
      description: 'View all your enrolled courses',
      icon: <SchoolIcon sx={{ fontSize: 48, color: '#388e3c' }} />,
      action: () => {},
      actionLabel: 'View Courses',
      color: '#e8f5e9',
    },
  ];

  const recentCourses = [
    { id: 1, name: 'Introduction to React', instructor: 'Dr. John Smith', status: 'Active' },
    { id: 2, name: 'Advanced JavaScript', instructor: 'Prof. Sarah Johnson', status: 'Active' },
    { id: 3, name: 'Web Development Fundamentals', instructor: 'Dr. Michael Brown', status: 'Completed' },
  ];

  return (
    <Box sx={{ background: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#333',
              mb: 1,
            }}
          >
            Welcome Back, {auth.name}! 👋
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
            }}
          >
            Here you can submit feedback for your courses and engage with your education.
          </Typography>
        </Box>

        {/* Dashboard Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {dashboardCards.map((card) => (
            <Grid item xs={12} sm={6} key={card.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  background: card.color,
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 2 }}>{card.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#333',
                      mb: 1,
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      mb: 2,
                      flex: 1,
                    }}
                  >
                    {card.description}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={card.action}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {card.actionLabel}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Courses Section */}
        <Card sx={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#333',
                mb: 2,
              }}
            >
              Your Current Courses
            </Typography>
            <Box>
              {recentCourses.map((course) => (
                <Box
                  key={course.id}
                  sx={{
                    p: 2,
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: '#333',
                      }}
                    >
                      {course.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#999',
                        mt: 0.5,
                      }}
                    >
                      {course.instructor}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      background: course.status === 'Active' ? '#e3f2fd' : '#f5f5f5',
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: course.status === 'Active' ? '#1976d2' : '#999',
                        fontWeight: 600,
                      }}
                    >
                      {course.status}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default StudentDashboard;
