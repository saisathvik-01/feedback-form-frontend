import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Fab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Skeleton
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import AdminLayout from '../layout/AdminLayout';
import { createForm, getAllForms, updateForm, deleteForm } from '../utils/api';

const FormBuilder = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true,
    questions: []
  });
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const response = await getAllForms();
      setForms(response.data || []);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (form = null) => {
    if (form) {
      setEditingForm(form);
      setFormData({
        title: form.title,
        description: form.description || '',
        isActive: form.isActive,
        questions: form.questions.map(q => ({
          id: q.id,
          questionText: q.questionText,
          type: q.type,
          options: q.options || [],
          orderIndex: q.orderIndex
        }))
      });
    } else {
      setEditingForm(null);
      setFormData({
        title: '',
        description: '',
        isActive: true,
        questions: []
      });
    }
    setErrors({});
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingForm(null);
    setFormData({
      title: '',
      description: '',
      isActive: true,
      questions: []
    });
    setErrors({});
  };

  const addQuestion = () => {
    const newQuestion = {
      questionText: '',
      type: 'TEXT',
      options: [],
      orderIndex: formData.questions.length
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    // Reorder remaining questions
    updatedQuestions.forEach((q, i) => q.orderIndex = i);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }
    updatedQuestions[questionIndex].options.push('');
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Form title is required';
    }

    if (formData.questions.length === 0) {
      newErrors.questions = 'At least one question is required';
    }

    formData.questions.forEach((question, index) => {
      if (!question.questionText.trim()) {
        newErrors[`question_${index}`] = 'Question text is required';
      }

      if (question.type === 'MCQ') {
        if (!question.options || question.options.length < 2) {
          newErrors[`question_${index}_options`] = 'MCQ questions must have at least 2 options';
        } else {
          question.options.forEach((option, optionIndex) => {
            if (!option.trim()) {
              newErrors[`question_${index}_option_${optionIndex}`] = 'Option cannot be empty';
            }
          });
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitLoading(true);
      const submitData = {
        ...formData,
        questions: formData.questions.map((q, index) => ({
          ...q,
          orderIndex: index
        }))
      };

      if (editingForm) {
        await updateForm(editingForm.id, submitData);
      } else {
        await createForm(submitData);
      }

      await loadForms();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving form:', error);
      setErrors({ submit: error.response?.data?.message || 'Error saving form' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteForm = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await deleteForm(formId);
        await loadForms();
      } catch (error) {
        console.error('Error deleting form:', error);
        alert('Error deleting form');
      }
    }
  };

  const renderQuestionType = (question, index) => {
    switch (question.type) {
      case 'TEXT':
        return (
          <TextField
            fullWidth
            label="Text Response"
            disabled
            helperText="Students will enter text here"
            sx={{ mt: 1 }}
          />
        );
      case 'RATING':
        return (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Rating Scale (1-5 stars)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ fontSize: '20px', color: '#ffd700' }}>★</span>
              ))}
            </Box>
          </Box>
        );
      case 'MCQ':
        return (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Multiple Choice Options:
            </Typography>
            {question.options?.map((option, optionIndex) => (
              <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={option}
                  onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                  error={!!errors[`question_${index}_option_${optionIndex}`]}
                  helperText={errors[`question_${index}_option_${optionIndex}`]}
                />
                <IconButton
                  color="error"
                  onClick={() => removeOption(index, optionIndex)}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              size="small"
              onClick={() => addOption(index)}
              startIcon={<AddIcon />}
            >
              Add Option
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Form Builder
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2 }}
          >
            Create New Form
          </Button>
        </Box>

        {/* Forms List */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your Forms
            </Typography>
            {loading ? (
              <Box>
                {[1, 2, 3].map((i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Skeleton height={60} />
                  </Box>
                ))}
              </Box>
            ) : forms.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No forms created yet. Click "Create New Form" to get started.
              </Typography>
            ) : (
              <List>
                {forms.map((form, index) => (
                  <React.Fragment key={form.id}>
                    <ListItem>
                      <ListItemText
                        primary={form.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {form.description || 'No description'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Chip
                                label={`${form.questions?.length || 0} questions`}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={form.isActive ? 'Active' : 'Inactive'}
                                size="small"
                                color={form.isActive ? 'success' : 'default'}
                              />
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => handleOpenDialog(form)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteForm(form.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < forms.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Form Dialog */}
        <Dialog
          open={open}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 2,
              maxHeight: '90vh'
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            {editingForm ? 'Edit Form' : 'Create New Form'}
          </DialogTitle>
          <DialogContent sx={{ pb: 1 }}>
            {errors.submit && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.submit}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Form Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={!!errors.title}
              helperText={errors.title}
              sx={{ mb: 2, mt: 1 }}
            />

            <TextField
              fullWidth
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
                label="Status"
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="h6" sx={{ mb: 2 }}>
              Questions
            </Typography>

            {errors.questions && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.questions}
              </Alert>
            )}

            {formData.questions.map((question, index) => (
              <Card key={index} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                      Question {index + 1}
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => removeQuestion(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <TextField
                    fullWidth
                    label="Question Text"
                    value={question.questionText}
                    onChange={(e) => updateQuestion(index, 'questionText', e.target.value)}
                    error={!!errors[`question_${index}`]}
                    helperText={errors[`question_${index}`]}
                    sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Question Type</InputLabel>
                    <Select
                      value={question.type}
                      onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                      label="Question Type"
                    >
                      <MenuItem value="TEXT">Text Response</MenuItem>
                      <MenuItem value="RATING">Rating (1-5 stars)</MenuItem>
                      <MenuItem value="MCQ">Multiple Choice</MenuItem>
                    </Select>
                  </FormControl>

                  {renderQuestionType(question, index)}

                  {errors[`question_${index}_options`] && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {errors[`question_${index}_options`]}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addQuestion}
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Question
            </Button>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog} disabled={submitLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={submitLoading}
            >
              {submitLoading ? 'Saving...' : (editingForm ? 'Update Form' : 'Create Form')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button for mobile */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', md: 'none' }
          }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>
      </Container>
    </AdminLayout>
  );
};

export default FormBuilder;