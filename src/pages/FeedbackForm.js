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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { courses } from '../data/demoData';
import { submitFeedback } from '../utils/api';

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
    courseId: '',
    courseName: '',
    rating: 0,
    comment: '',
    ratings: {
      content: 0,
      teaching: 0,
      engagement: 0,
      facilities: 0,
    },
  });

  // UI state
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [duplicateDialog, setDuplicateDialog] = useState(false);
  const [apiError, setApiError] = useState('');

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
    if (formData.ratings.content === 0) {
      newErrors.content = 'Please rate course content';
    }
    if (formData.ratings.teaching === 0) {
      newErrors.teaching = 'Please rate teaching quality';
    }
    if (formData.ratings.engagement === 0) {
      newErrors.engagement = 'Please rate engagement';
    }
    if (formData.ratings.facilities === 0) {
      newErrors.facilities = 'Please rate facilities';
    }
    if (!formData.comment.trim()) {
      newErrors.comment = 'Please provide feedback comments';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Find the selected course to get courseId and courseName
      const selectedCourse = courses.find(c => c.name === formData.course);
      
      const feedbackPayload = {
        courseId: selectedCourse?.id || formData.courseId,
        courseName: formData.course,
        facultyName: formData.faculty,
        semester: 'Spring',
        academicYear: '2025-26',
        rating: formData.rating || Math.round((formData.ratings.content + formData.ratings.teaching + formData.ratings.engagement + formData.ratings.facilities) / 4),
        comment: formData.comment,
        ratings: formData.ratings,
      };

      await submitFeedback(feedbackPayload);
      setSubmitted(true);
      setLoading(false);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          course: '',
          faculty: '',
          courseId: '',
          courseName: '',
          rating: 0,
          comment: '',
          ratings: {
            content: 0,
            teaching: 0,
            engagement: 0,
            facilities: 0,
          },
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      setLoading(false);
      const errorMessage = error.message || 'Failed to submit feedback';
      
      // Check if it's a duplicate submission error
      if (errorMessage.includes('already submitted') || errorMessage.includes('twice')) {
        setDuplicateDialog(true);
      } else {
        setApiError(errorMessage);
      }
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

            {/* API Error Message */}
            {apiError && (
              <Box sx={{ mb: 3 }}>
                <Alert
                  severity="error"
                  onClose={() => setApiError('')}
                  sx={{
                    borderRadius: 2,
                    fontSize: '0.95rem',
                  }}
                >
                  {apiError}
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

        {/* Duplicate Submission Dialog */}
        <Dialog
          open={duplicateDialog}
          onClose={() => setDuplicateDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700, color: '#d32f2f' }}>
            <WarningIcon color="error" />
            Feedback Already Submitted
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Typography variant="body1" color="textSecondary" paragraph>
              You have already submitted feedback for this subject with this faculty member.
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
              Each course-faculty combination allows only one feedback submission. If you'd like to update your feedback, please contact admin support.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setDuplicateDialog(false)}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default FeedbackForm;
