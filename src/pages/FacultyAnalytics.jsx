import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Alert,
  Paper,
  Rating,
  Divider
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import AdminLayout from '../layout/AdminLayout';
import api from '../utils/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const FacultyAnalytics = () => {
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageRating: 0,
    courseBreakdown: [],
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFacultyAnalytics();
  }, []);

  const loadFacultyAnalytics = async () => {
    try {
      setLoading(true);
      // Get all feedback to compute analytics
      const analyticsData = await api.get('/analytics/faculty');
      
      if (analyticsData && analyticsData.length > 0) {
        // Calculate aggregated stats
        const total = analyticsData.length;
        const avgRating = (analyticsData.reduce((sum, item) => sum + (item.averageRating || 0), 0) / total).toFixed(1);
        
        // Group by course (no student names needed)
        const courseMap = {};
        const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        analyticsData.forEach(item => {
          if (!courseMap[item.courseName]) {
            courseMap[item.courseName] = [];
          }
          courseMap[item.courseName].push(item.averageRating);
        });

        const courseBreakdown = Object.entries(courseMap).map(([course, ratings]) => ({
          courseName: course,
          averageRating: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
          count: ratings.length
        }));

        // Calculate rating distribution
        analyticsData.forEach(item => {
          const rating = Math.round(item.averageRating);
          if (rating >= 1 && rating <= 5) {
            ratingDist[rating]++;
          }
        });

        setStats({
          totalFeedback: total,
          averageRating: avgRating,
          courseBreakdown,
          ratingDistribution: ratingDist
        });
      }
      setError('');
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const ratingDistData = Object.entries(stats.ratingDistribution).map(([rating, count]) => ({
    name: `${rating}★`,
    value: count
  }));

  if (error) {
    return (
      <AdminLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Your Feedback Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Aggregated feedback summary and performance metrics (No student identifiable information)
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                {loading ? (
                  <Skeleton height={60} />
                ) : (
                  <>
                    <Typography color="textSecondary" gutterBottom>
                      Total Feedback
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalFeedback}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                {loading ? (
                  <Skeleton height={60} />
                ) : (
                  <>
                    <Typography color="textSecondary" gutterBottom>
                      Average Rating
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={parseFloat(stats.averageRating)} readOnly precision={0.1} />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {stats.averageRating}/5
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Course Breakdown */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Performance by Course
              </Typography>
              {loading ? (
                <Skeleton height={300} />
              ) : stats.courseBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.courseBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="courseName" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="averageRating" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary">No data available</Typography>
              )}
            </Paper>
          </Grid>

          {/* Rating Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Rating Distribution
              </Typography>
              {loading ? (
                <Skeleton height={300} />
              ) : ratingDistData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ratingDistData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ratingDistData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary">No data available</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Course Details Table */}
        {!loading && stats.courseBreakdown.length > 0 && (
          <Paper sx={{ mt: 4, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Detailed Course Analysis
            </Typography>
            {stats.courseBreakdown.map((course, idx) => (
              <Box key={idx} sx={{ mb: idx !== stats.courseBreakdown.length - 1 ? 2 : 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {course.courseName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Rating value={parseFloat(course.averageRating)} readOnly precision={0.1} />
                    <Typography variant="body2" color="textSecondary">
                      {course.averageRating}/5 ({course.count} responses)
                    </Typography>
                  </Box>
                </Box>
                {idx !== stats.courseBreakdown.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        )}

        {/* Privacy Notice */}
        <Alert severity="info" sx={{ mt: 4 }}>
          This analytics dashboard shows only aggregated feedback data. Individual student names and identities are NOT displayed for privacy compliance.
        </Alert>
      </Container>
    </AdminLayout>
  );
};

export default FacultyAnalytics;
