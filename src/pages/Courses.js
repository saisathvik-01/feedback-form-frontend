import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useNavigate } from 'react-router-dom';
import { getMyFeedback } from '../utils/api';

function Courses() {
  const [submittedFeedback, setSubmittedFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const courses = [
    { id: 1, name: "Introduction to React", instructor: "Dr. John Smith", courseId: "CS101", section: "A", semester: "3", academicYear: "2025-2026" },
    { id: 2, name: "Advanced JavaScript", instructor: "Prof. Sarah Johnson", courseId: "CS102", section: "B", semester: "3", academicYear: "2025-2026" },
    { id: 3, name: "Web Development Fundamentals", instructor: "Dr. Michael Brown", courseId: "CS103", section: "A", semester: "3", academicYear: "2025-2026" },
  ];

  useEffect(() => {
    const fetchSubmittedFeedback = async () => {
      try {
        const feedback = await getMyFeedback();
        setSubmittedFeedback(feedback);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmittedFeedback();
  }, []);

  const isFeedbackSubmitted = (courseId, facultyName) => {
    return submittedFeedback.some(feedback =>
      feedback.courseId === courseId && feedback.facultyName === facultyName
    );
  };

  const handleFeedbackClick = (course) => {
    if (isFeedbackSubmitted(course.courseId, course.instructor)) {
      setSelectedCourse(course);
      setDialogOpen(true);
    } else {
      // Navigate to feedback form with pre-filled data
      navigate('/form', {
        state: {
          courseData: {
            courseId: course.courseId,
            courseName: course.name,
            facultyName: course.instructor,
            section: course.section,
            semester: course.semester,
            academicYear: course.academicYear
          }
        }
      });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 3 }}>
          My Courses
        </Typography>
        <Card sx={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <Typography variant="h6" sx={{ color: '#6b7280' }}>
              Loading courses...
            </Typography>
          </Box>
        </Card>
      </Container>
    );
  }

  if (courses.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 3 }}>
          My Courses
        </Typography>
        <Card sx={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 2 }}>
              No courses available
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', textAlign: 'center' }}>
              You don't have any enrolled courses at the moment. Please contact your administrator if you believe this is an error.
            </Typography>
          </Box>
        </Card>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 3 }}>
        My Courses
      </Typography>

      <Card sx={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Course ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Course Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Instructor</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Section</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => {
                  const submitted = isFeedbackSubmitted(course.courseId, course.instructor);
                  return (
                    <TableRow key={course.id}>
                      <TableCell>{course.courseId}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.instructor}</TableCell>
                      <TableCell>{course.section}</TableCell>
                      <TableCell>
                        {submitted ? (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Feedback Submitted"
                            color="success"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        ) : (
                          <Chip
                            icon={<ScheduleIcon />}
                            label="Pending"
                            color="warning"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {submitted ? (
                          <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Submitted
                          </Typography>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleFeedbackClick(course)}
                            sx={{ textTransform: 'none' }}
                          >
                            Give Feedback
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog for already submitted feedback */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Feedback Already Submitted</DialogTitle>
        <DialogContent>
          <Typography>
            You have already submitted feedback for <strong>{selectedCourse?.name}</strong> with instructor <strong>{selectedCourse?.instructor}</strong>.
            You can only submit feedback once per course and instructor combination.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Courses;
