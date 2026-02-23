import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * CreateForm Component - Faculty page to create feedback forms
 */
const CreateForm = ({ auth }) => {
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState('');

  // Add new question field
  const handleAddQuestion = () => {
    setQuestions([...questions, '']);
  };

  // Update question
  const handleUpdateQuestion = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  // Delete question
  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors('');

    // Validation
    if (!formTitle.trim()) {
      setErrors('Please enter a form title');
      return;
    }

    if (questions.filter((q) => q.trim()).length === 0) {
      setErrors('Please add at least one question');
      return;
    }

    // Simulate form creation
    console.log('Form created:', {
      title: formTitle,
      description: formDescription,
      questions: questions.filter((q) => q.trim()),
      createdBy: auth?.name || "User",
    });

    setSubmitted(true);

    // Reset form
    setTimeout(() => {
      setFormTitle('');
      setFormDescription('');
      setQuestions(['']);
      setSubmitted(false);
    }, 2000);
  };

  return (
    <Box sx={{ background: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#333',
              mb: 1,
            }}
          >
            Create New Feedback Form
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
            }}
          >
            Design a custom feedback form for your course
          </Typography>
        </Box>

        {/* Main Card */}
        <Card sx={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Success Message */}
            {submitted && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                Form created successfully! Your feedback form is now ready for students.
              </Alert>
            )}

            {/* Error Message */}
            {errors && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {errors}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                {/* Form Title */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Form Title *"
                    placeholder="e.g., CS 101 - Introductory Programming"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Form Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="description"
                    label="Form Description"
                    placeholder="Optional: Add instructions or context for students"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Questions Section */}
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#333',
                      mb: 2,
                    }}
                  >
                    Questions
                  </Typography>

                  {questions.map((question, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <TextField
                        fullWidth
                        label={`Question ${index + 1}`}
                        placeholder="Enter your question"
                        value={question}
                        onChange={(e) => handleUpdateQuestion(index, e.target.value)}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#1976d2',
                            },
                          },
                        }}
                      />
                      {questions.length > 1 && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteQuestion(index)}
                          sx={{ minWidth: 'auto', px: 2 }}
                        >
                          <DeleteIcon />
                        </Button>
                      )}
                    </Box>
                  ))}

                  {/* Add Question Button */}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddQuestion}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Add Question
                  </Button>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: 2,
                      }}
                    >
                      Create Form
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CreateForm;
