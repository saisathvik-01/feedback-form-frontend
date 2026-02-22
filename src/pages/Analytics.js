import React from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

/**
 * Analytics Component - Faculty analytics and insights page
 */
const Analytics = ({ auth }) => {
  const navigate = useNavigate();

  const analyticsCards = [
    {
      id: 1,
      title: 'Total Responses',
      value: '245',
      icon: '📊',
      color: '#e3f2fd',
    },
    {
      id: 2,
      title: 'Average Rating',
      value: '4.5/5',
      icon: '⭐',
      color: '#fff3e0',
    },
    {
      id: 3,
      title: 'Forms Created',
      value: '12',
      icon: '📋',
      color: '#e8f5e9',
    },
    {
      id: 4,
      title: 'Response Rate',
      value: '78%',
      icon: '📈',
      color: '#f3e5f5',
    },
  ];

  return (
    <Box sx={{ background: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin')}
            sx={{ mr: 2, textTransform: 'none' }}
          >
            Back
          </Button>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#333',
              }}
            >
              Feedback Analytics
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                mt: 0.5,
              }}
            >
              View insights from your feedback forms
            </Typography>
          </Box>
        </Box>

        {/* Analytics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {analyticsCards.map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.id}>
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
                    <Box sx={{ fontSize: '2rem' }}>{card.icon}</Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Placeholder */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', minHeight: '400px' }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    mb: 2,
                  }}
                >
                  Rating Distribution
                </Typography>
                <Box
                  sx={{
                    height: '300px',
                    background: '#f5f5f5',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #e0e0e0',
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <BarChartIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      Chart placeholder - Ready for implementation
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', minHeight: '400px' }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    mb: 2,
                  }}
                >
                  Response Trends
                </Typography>
                <Box
                  sx={{
                    height: '300px',
                    background: '#f5f5f5',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #e0e0e0',
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <BarChartIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      Chart placeholder - Ready for implementation
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Analytics;
