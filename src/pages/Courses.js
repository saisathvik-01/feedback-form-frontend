import React from 'react';
import { Container, Card, CardContent, Typography, Grid } from '@mui/material';

const courses = [
  {
    id: 1,
    name: 'Introduction to React',
    instructor: 'Dr. John Smith',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Advanced JavaScript',
    instructor: 'Prof. Sarah Johnson',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Web Development Fundamentals',
    instructor: 'Dr. Michael Brown',
    status: 'Completed',
  },
];

function Courses() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 3 }}>
        My Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card
              sx={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                  {course.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  {course.instructor}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'inline-block',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    background: course.status === 'Active' ? '#e3f2fd' : '#e8f5e9',
                    color: course.status === 'Active' ? '#1976d2' : '#388e3c',
                    fontWeight: 600,
                  }}
                >
                  {course.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Courses;
