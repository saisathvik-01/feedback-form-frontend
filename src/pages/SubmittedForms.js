import React from 'react';
import { Container, Card, CardContent, Typography, Grid } from '@mui/material';
import { submittedForms } from '../data/demoData';

function SubmittedForms() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 3 }}>
        My Submitted Feedback
      </Typography>
      <Grid container spacing={3}>
        {submittedForms.map((form) => (
          <Grid item xs={12} sm={6} md={4} key={form.id}>
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
                  {form.course}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                  Rating: {form.rating}
                </Typography>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  Submitted on {form.date}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default SubmittedForms;
