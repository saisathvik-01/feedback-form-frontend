import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating,
  Button,
  Grid,
  Alert,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { courses } from '../data/demoData';

/**
 * FeedbackForm Component
 * A professional, responsive feedback form for students to evaluate courses and faculty
 * Uses Material UI components for modern design
 */
const FeedbackForm = ({ auth }) => {
  // Form data state
  const [formData, setFormData] = useState({
    course: '',
    faculty: '',
    teachingQuality: 0,
    courseContent: 0,
    communication: 0,
    overallSatisfaction: 0,
    comments: '',
  });

  // UI state
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Sample faculty data (courses imported from shared demo data)

  const faculty = [
    { id: 1, name: 'Dr. John Smith' },
    { id: 2, name: 'Prof. Sarah Johnson' },
    { id: 3, name: 'Dr. Michael Brown' },
    { id: 4, name: 'Prof. Emily Davis' },
    { id: 5, name: 'Dr. James Wilson' },
    { id: 6, name: 'Prof. Lisa Anderson' },
  ];

  // Handle dropdown changes
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle rating changes
  const handleRatingChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  // Handle text input changes
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.course) {
      newErrors.course = 'Please select a course';
    }
    if (!formData.faculty) {
      newErrors.faculty = 'Please select a faculty member';
    }
    if (formData.teachingQuality === 0) {
      newErrors.teachingQuality = 'Please rate teaching quality';
    }
    if (formData.courseContent === 0) {
      newErrors.courseContent = 'Please rate course content';
    }
    if (formData.communication === 0) {
      newErrors.communication = 'Please rate communication';
    }
    if (formData.overallSatisfaction === 0) {
      newErrors.overallSatisfaction = 'Please rate overall satisfaction';
    }
    if (!formData.comments.trim()) {
      newErrors.comments = 'Please provide comments';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      
      // Simulate form submission delay
      setTimeout(() => {
        console.log('Form data submitted:', formData);
        setSubmitted(true);
        setLoading(false);

        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            course: '',
            faculty: '',
            teachingQuality: 0,
            courseContent: 0,
            communication: 0,
            overallSatisfaction: 0,
            comments: '',
          });
          setSubmitted(false);
        }, 3000);
      }, 800);
    }
  };

  // Render component
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        {/* Main Card */}
        <Card
          sx={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Success Message */}
            {submitted && (
              <Box sx={{ mb: 3 }}>
                <Alert
                  icon={<CheckCircleIcon fontSize="inherit" />}
                  severity="success"
                  sx={{
                    borderRadius: 2,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                  }}
                >
                  Thank you! Your feedback has been submitted successfully. We appreciate your valuable insights.
                </Alert>
              </Box>
            )}

            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: '#1a237e',
                  mb: 1,
                  letterSpacing: -0.5,
                }}
              >
                Student Feedback Form
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                }}
              >
                Your feedback helps us improve the quality of education. Please take a moment to share your honest opinions about this course and instructor.
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                {/* Course Selection */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.course} variant="outlined">
                    <InputLabel id="course-label" sx={{ fontWeight: 500 }}>
                      Course Name *
                    </InputLabel>
                    <Select
                      labelId="course-label"
                      name="course"
                      value={formData.course}
                      onChange={handleSelectChange}
                      label="Course Name *"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#1976d2',
                          },
                        },
                      }}
                    >
                      {courses.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.course && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#d32f2f',
                          mt: 0.5,
                          display: 'block',
                          fontWeight: 500,
                        }}
                      >
                        {errors.course}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Faculty Selection */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.faculty} variant="outlined">
                    <InputLabel id="faculty-label" sx={{ fontWeight: 500 }}>
                      Faculty Name *
                    </InputLabel>
                    <Select
                      labelId="faculty-label"
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleSelectChange}
                      label="Faculty Name *"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#1976d2',
                          },
                        },
                      }}
                    >
                      {faculty.map((member) => (
                        <MenuItem key={member.id} value={member.id}>
                          {member.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.faculty && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#d32f2f',
                          mt: 0.5,
                          display: 'block',
                          fontWeight: 500,
                        }}
                      >
                        {errors.faculty}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Divider */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#666' }}>
                      Rate Your Experience
                    </Typography>
                  </Divider>
                </Grid>

                {/* Teaching Quality Rating */}
                <Grid item xs={12}>
                  <Box sx={{ p: 2.5, background: '#f8f9fa', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: '#1a237e',
                        }}
                      >
                        Teaching Quality *
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: formData.teachingQuality > 0 ? '#1976d2' : '#999',
                          fontWeight: 600,
                        }}
                      >
                        {formData.teachingQuality > 0 ? `${formData.teachingQuality}/5` : 'Not rated'}
                      </Typography>
                    </Box>
                    <Rating
                      name="teachingQuality"
                      value={formData.teachingQuality}
                      onChange={(e, value) => handleRatingChange('teachingQuality', value)}
                      size="large"
                      sx={{
                        '& .MuiRating-icon': {
                          fontSize: '2rem',
                        },
                      }}
                    />
                    {errors.teachingQuality && (
                      <Typography variant="caption" sx={{ color: '#d32f2f', mt: 1, display: 'block', fontWeight: 500 }}>
                        {errors.teachingQuality}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Course Content Rating */}
                <Grid item xs={12}>
                  <Box sx={{ p: 2.5, background: '#f8f9fa', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: '#1a237e',
                        }}
                      >
                        Course Content *
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: formData.courseContent > 0 ? '#1976d2' : '#999',
                          fontWeight: 600,
                        }}
                      >
                        {formData.courseContent > 0 ? `${formData.courseContent}/5` : 'Not rated'}
                      </Typography>
                    </Box>
                    <Rating
                      name="courseContent"
                      value={formData.courseContent}
                      onChange={(e, value) => handleRatingChange('courseContent', value)}
                      size="large"
                      sx={{
                        '& .MuiRating-icon': {
                          fontSize: '2rem',
                        },
                      }}
                    />
                    {errors.courseContent && (
                      <Typography variant="caption" sx={{ color: '#d32f2f', mt: 1, display: 'block', fontWeight: 500 }}>
                        {errors.courseContent}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Communication Rating */}
                <Grid item xs={12}>
                  <Box sx={{ p: 2.5, background: '#f8f9fa', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: '#1a237e',
                        }}
                      >
                        Communication *
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: formData.communication > 0 ? '#1976d2' : '#999',
                          fontWeight: 600,
                        }}
                      >
                        {formData.communication > 0 ? `${formData.communication}/5` : 'Not rated'}
                      </Typography>
                    </Box>
                    <Rating
                      name="communication"
                      value={formData.communication}
                      onChange={(e, value) => handleRatingChange('communication', value)}
                      size="large"
                      sx={{
                        '& .MuiRating-icon': {
                          fontSize: '2rem',
                        },
                      }}
                    />
                    {errors.communication && (
                      <Typography variant="caption" sx={{ color: '#d32f2f', mt: 1, display: 'block', fontWeight: 500 }}>
                        {errors.communication}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Overall Satisfaction Rating */}
                <Grid item xs={12}>
                  <Box sx={{ p: 2.5, background: '#f8f9fa', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: '#1a237e',
                        }}
                      >
                        Overall Satisfaction *
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: formData.overallSatisfaction > 0 ? '#1976d2' : '#999',
                          fontWeight: 600,
                        }}
                      >
                        {formData.overallSatisfaction > 0 ? `${formData.overallSatisfaction}/5` : 'Not rated'}
                      </Typography>
                    </Box>
                    <Rating
                      name="overallSatisfaction"
                      value={formData.overallSatisfaction}
                      onChange={(e, value) => handleRatingChange('overallSatisfaction', value)}
                      size="large"
                      sx={{
                        '& .MuiRating-icon': {
                          fontSize: '2rem',
                        },
                      }}
                    />
                    {errors.overallSatisfaction && (
                      <Typography variant="caption" sx={{ color: '#d32f2f', mt: 1, display: 'block', fontWeight: 500 }}>
                        {errors.overallSatisfaction}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Comments TextField */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    name="comments"
                    label="Additional Comments *"
                    placeholder="Share any additional feedback, suggestions, or constructive criticism..."
                    value={formData.comments}
                    onChange={handleTextChange}
                    error={!!errors.comments}
                    helperText={errors.comments}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                      },
                      '& .MuiInputBase-input': {
                        fontFamily: 'inherit',
                        lineHeight: 1.6,
                      },
                    }}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<SendIcon />}
                      disabled={loading}
                      sx={{
                        px: 5,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 700,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        textTransform: 'none',
                        letterSpacing: 0.3,
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        '&:disabled': {
                          opacity: 0.7,
                        },
                      }}
                    >
                      {loading ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Footer Note */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#999',
                  fontSize: '0.85rem',
                }}
              >
                * Required fields. All responses are anonymous and will be used to improve our courses.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default FeedbackForm;
