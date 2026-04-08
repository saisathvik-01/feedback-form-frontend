import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Rating,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Send as SendIcon } from '@mui/icons-material';
import AdminLayout from '../layout/AdminLayout';
import { getCourseById, getFormById, submitResponse, checkStudentSubmission } from '../utils/api';

const StudentFormPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [course, setCourse] = useState(null);
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [successDialog, setSuccessDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadCourseAndForm();
  }, [courseId]);

  const loadCourseAndForm = async () => {
    try {
      setLoading(true);

      // Check if already submitted
      const submissionCheck = await checkStudentSubmission(courseId);
      if (submissionCheck?.hasSubmitted) {
        setErrorMessage('You have already submitted feedback for this course.');
        return;
      }

      // Load course information
      const courseData = await getCourseById(courseId);
      const loadedCourse = Array.isArray(courseData) ? courseData[0] : courseData;
      setCourse(loadedCourse);

      // Load linked form for the course
      if (loadedCourse?.formId) {
        const loadedForm = await getFormById(loadedCourse.formId);
        setForm(loadedForm);

        const initialAnswers = {};
        if (loadedForm?.questions) {
          loadedForm.questions.forEach(question => {
            initialAnswers[question.id] = '';
          });
        }
        setAnswers(initialAnswers);
      }
    } catch (error) {
      console.error('Error loading course/form:', error);
      setErrorMessage(error.message || 'Error loading form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Clear error for this question
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form || !form.questions) {
      return false;
    }

    form.questions.forEach(question => {
      const answer = answers[question.id];
      if (!answer || answer.toString().trim() === '' || answer.toString() === '0') {
        newErrors[question.id] = 'This question is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert('Please answer all questions before submitting.');
      return;
    }

    try {
      setSubmitting(true);

      const responseData = {
        courseId: parseInt(courseId),
        formId: form.id,
        answers: answers
      };

      await submitResponse(responseData);
      setSuccessDialog(true);
    } catch (error) {
      console.error('Error submitting response:', error);
      setErrorMessage(error.message || 'Error submitting feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessDialog(false);
    navigate('/student-dashboard');
  };

  const renderQuestion = (question, index) => {
    const answer = answers[question.id];
    const error = errors[question.id];

    switch (question.type) {
      case 'TEXT':
        return (
          <Card key={question.id} sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Question {index + 1}: {question.questionText}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={answer || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Enter your answer here..."
                error={!!error}
                helperText={error}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        );

      case 'RATING':
        return (
          <Card key={question.id} sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Question {index + 1}: {question.questionText}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Rating
                  size="large"
                  value={parseInt(answer) || 0}
                  onChange={(e, value) => handleAnswerChange(question.id, value.toString())}
                />
                <Typography variant="body2" color="text.secondary">
                  {answer ? `${answer} out of 5` : 'Not rated'}
                </Typography>
              </Box>
              {error && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                  {error}
                </Typography>
              )}
            </CardContent>
          </Card>
        );

      case 'MCQ':
        return (
          <Card key={question.id} sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Question {index + 1}: {question.questionText}
              </Typography>
              <RadioGroup
                value={answer || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              >
                {question.options && question.options.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    value={option}
                    control={<Radio />}
                    label={option}
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
              {error && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                  {error}
                </Typography>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Container maxWidth="md" sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Container>
      </AdminLayout>
    );
  }

  if (errorMessage) {
    return (
      <AdminLayout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/student-dashboard')}
          >
            Back to Dashboard
          </Button>
        </Container>
      </AdminLayout>
    );
  }

  if (!course || !form) {
    return (
      <AdminLayout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error">
            Unable to load the form. Please try again.
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/student-dashboard')}
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Container>
      </AdminLayout>
    );
  }

  const questions = form.questions || [];
  const totalSteps = Math.ceil(questions.length / 3); // 3 questions per step

  return (
    <AdminLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/student-dashboard')}
          >
            Back
          </Button>
        </Box>

        {/* Course & Form Info */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {form.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Course: {course.courseName}
            </Typography>
            {form.description && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                {form.description}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Total Questions: {questions.length}
            </Typography>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {[...Array(totalSteps)].map((_, index) => (
            <Step key={index}>
              <StepLabel>Section {index + 1}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Questions */}
        <Box sx={{ mb: 4 }}>
          {questions.map((question, index) => (
            renderQuestion(question, index)
          ))}
        </Box>

        {/* Submit Button */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/student-dashboard')}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </Box>

        {/* Success Dialog */}
        <Dialog
          open={successDialog}
          onClose={handleSuccessClose}
        >
          <DialogTitle>Feedback Submitted Successfully</DialogTitle>
          <DialogContent>
            <Typography sx={{ mt: 2 }}>
              Thank you for providing your valuable feedback! Your responses have been recorded.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSuccessClose} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default StudentFormPage;