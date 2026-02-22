import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

/**
 * AdminDashboard Component - Faculty dashboard
 */
const AdminDashboard = ({ auth }) => {
  const navigate = useNavigate();

  const statCards = [
    {
      title: 'Total Students',
      value: '1,250',
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#e3f2fd',
    },
    {
      title: 'Total Feedback',
      value: '3,847',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: '#388e3c' }} />,
      color: '#e8f5e9',
    },
    {
      title: 'Forms Created',
      value: '12',
      icon: <BarChartIcon sx={{ fontSize: 40, color: '#f57c00' }} />,
      color: '#fff3e0',
    },
    {
      title: 'Active Courses',
      value: '8',
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 40, color: '#7b1fa2' }} />,
      color: '#f3e5f5',
    },
  ];

  const recentFeedback = [
    {
      id: 1,
      student: 'Alice Johnson',
      course: 'React Basics',
      rating: 4.5,
      date: '2026-02-20',
    },
    {
      id: 2,
      student: 'Bob Smith',
      course: 'JavaScript Advanced',
      rating: 4.0,
      date: '2026-02-21',
    },
    {
      id: 3,
      student: 'Charlie Brown',
      course: 'Web Development',
      rating: 4.8,
      date: '2026-02-22',
    },
    {
      id: 4,
      student: 'Diana Davis',
      course: 'UI/UX Design',
      rating: 4.2,
      date: '2026-02-22',
    },
  ];

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 4) return 'info';
    if (rating >= 3) return 'warning';
    return 'error';
  };

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
            Welcome Back, {auth?.name || 'Faculty'}! 👋
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
            }}
          >
            Monitor your feedback forms and student responses
          </Typography>
        </Box>

        {/* Quick Action Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                },
              }}
              onClick={() => navigate('/create')}
            >
              <CardContent sx={{ p: 3 }}>
                <AssignmentIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Create Feedback Form
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Design and launch a new feedback form
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: '#fff',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                },
              }}
              onClick={() => navigate('/analytics')}
            >
              <CardContent sx={{ p: 3 }}>
                <BarChartIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  View Analytics
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Analyze feedback data and trends
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  background: card.color,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: '#333',
                        }}
                      >
                        {card.value}
                      </Typography>
                    </Box>
                    <Box>{card.icon}</Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Feedback Section */}
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
              Recent Feedback Submissions
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              {recentFeedback.length > 0 ? (
                <Box
                  component="table"
                  sx={{
                    width: '100%',
                    borderCollapse: 'collapse',
                  }}
                >
                  <Box component="thead">
                    <Box
                      component="tr"
                      sx={{
                        background: '#f5f5f5',
                        borderBottom: '2px solid #e0e0e0',
                      }}
                    >
                      <Box component="th" sx={{ textAlign: 'left', p: 2, fontWeight: 700 }}>
                        Student Name
                      </Box>
                      <Box component="th" sx={{ textAlign: 'left', p: 2, fontWeight: 700 }}>
                        Course
                      </Box>
                      <Box component="th" sx={{ textAlign: 'center', p: 2, fontWeight: 700 }}>
                        Rating
                      </Box>
                      <Box component="th" sx={{ textAlign: 'center', p: 2, fontWeight: 700 }}>
                        Date
                      </Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {recentFeedback.map((feedback) => (
                      <Box
                        component="tr"
                        key={feedback.id}
                        sx={{
                          borderBottom: '1px solid #e0e0e0',
                          '&:hover': { background: '#f9f9f9' },
                        }}
                      >
                        <Box component="td" sx={{ p: 2, color: '#333', fontWeight: 600 }}>
                          {feedback.student}
                        </Box>
                        <Box component="td" sx={{ p: 2, color: '#666' }}>
                          {feedback.course}
                        </Box>
                        <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                          <Chip
                            label={`${feedback.rating}/5`}
                            color={getRatingColor(feedback.rating)}
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        <Box component="td" sx={{ p: 2, textAlign: 'center', color: '#999' }}>
                          {feedback.date}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: '#999', textAlign: 'center', py: 3 }}>
                  No recent feedback yet
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
