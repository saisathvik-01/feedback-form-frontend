import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Skeleton,
  Box,
  Alert,
  Chip,
  LinearProgress
} from '@mui/material';
import { School as SchoolIcon, EmojiEvents as CheckedIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import { getAllCourses, checkStudentSubmission } from '../utils/api';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await getAllCourses();
      setCourses(Array.isArray(coursesData) ? coursesData : coursesData.data || []);
      
      // Check submission status for each course
      const courseList = Array.isArray(coursesData) ? coursesData : coursesData.data || [];
      if (courseList.length) {
        const statuses = {};
        for (const course of courseList) {
          try {
            const result = await checkStudentSubmission(course.id);
            statuses[course.id] = result?.hasSubmitted || false;
          } catch (error) {
            statuses[course.id] = false;
          }
        }
        setSubmissionStatus(statuses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGiveFeedback = (courseId) => {
    navigate(`/course/${courseId}/feedback`);
  };

  const CourseCard = ({ course }) => {
    const isSubmitted = submissionStatus[course.id] || false;

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid #e0e0e0',
          background: isSubmitted ? '#f5f5f5' : 'white',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)'
          },
          opacity: isSubmitted ? 0.7 : 1
        }}
      >
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <SchoolIcon sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
            {isSubmitted && (
              <Chip
                icon={<CheckedIcon />}
                label="Submitted"
                color="success"
                size="small"
                variant="outlined"
              />
            )}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {course.courseName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {course.formId ? 'Feedback form available' : 'No feedback form assigned'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleGiveFeedback(course.id)}
            disabled={isSubmitted || !course.formId}
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {isSubmitted ? 'Already Submitted' : 'Give Feedback'}
          </Button>
        </CardActions>
      </Card>
    );
  };

  const CourseCardSkeleton = () => (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Skeleton width="100%" height={40} sx={{ mb: 2 }} />
        <Skeleton width="80%" height={20} sx={{ mb: 1 }} />
        <Skeleton width="60%" height={16} />
      </CardContent>
      <CardActions>
        <Skeleton width="100%" height={36} />
      </CardActions>
    </Card>
  );

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Available Courses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select a course below to provide your feedback. You can submit feedback only once per course.
          </Typography>
        </Box>

        {/* Info Alert */}
        {Object.values(submissionStatus).some(status => status) && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You have already submitted feedback for {Object.values(submissionStatus).filter(s => s).length} 
            {' '} course(s). Thank you for your valuable feedback!
          </Alert>
        )}

        {/* Courses Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <CourseCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : courses.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              backgroundColor: '#f5f5f5',
              borderRadius: 2
            }}
          >
            <SchoolIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Courses Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please check back later for available courses.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <CourseCard course={course} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Summary Section */}
        {courses.length > 0 && (
          <Box sx={{ mt: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              FEEDBACK PROGRESS
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(Object.values(submissionStatus).filter(s => s).length / courses.length) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="body2" sx={{ minWidth: 100, textAlign: 'right' }}>
                {Object.values(submissionStatus).filter(s => s).length} of {courses.length} completed
              </Typography>
            </Box>
          </Box>
        )}
      </Container>
    </AdminLayout>
  );
};

export default StudentDashboard;
