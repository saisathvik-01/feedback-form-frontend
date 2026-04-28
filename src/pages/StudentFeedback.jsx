import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import { submitFeedback, getAllForms } from '../utils/api';

const StudentFeedback = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    studentName: '',
    courseId: '',
    courseName: '',
    facultyName: '',
    section: '',
    semester: '',
    academicYear: '',
    rating: '',
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState([]);
  const [formsLoading, setFormsLoading] = useState(true);
  const [formsError, setFormsError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    setUser(currentUser);

    // Pre-fill data from navigation state (from courses page)
    const courseData = location.state?.courseData;
    if (courseData) {
      setFormData(prev => ({
        ...prev,
        courseId: courseData.courseId || '',
        courseName: courseData.courseName || '',
        facultyName: courseData.facultyName || '',
        section: courseData.section || '',
        semester: courseData.semester || '',
        academicYear: courseData.academicYear || ''
      }));
    }

    if (currentUser && currentUser.role === 'STUDENT') {
      setFormData(prev => ({
        ...prev,
        studentName: currentUser.username || currentUser.email
      }));
    }

    loadForms();
  }, [location.state]);

  const loadForms = async () => {
    try {
      setFormsLoading(true);
      const response = await getAllForms();
      setForms(Array.isArray(response) ? response : response.data || []);
      setFormsError('');
    } catch (error) {
      console.error('Error loading forms:', error);
      setFormsError(error?.message || 'Unable to load forms.');
    } finally {
      setFormsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      courseId: formData.courseId,
      courseName: formData.courseName,
      facultyName: formData.facultyName,
      semester: formData.semester,
      academicYear: formData.academicYear,
      section: formData.section,
      rating: Number(formData.rating),
      comment: formData.comment,
      ratings: { overall: Number(formData.rating) }
    };

    console.debug('[Feedback] submitFeedback payload', payload, {
      tokenPresent: !!localStorage.getItem('token'),
      tokenPreview: localStorage.getItem('token')?.slice(0, 10)
    });

    try {
      await submitFeedback(payload);

      setFormData({
        studentName: user?.role === 'STUDENT' ? (user.username || user.email) : '',
        courseId: '',
        courseName: '',
        facultyName: '',
        section: '',
        semester: '',
        academicYear: '',
        rating: '',
        comment: ''
      });
      window.dispatchEvent(new Event('feedbackSubmitted'));
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      if (error?.message?.includes('Feedback already submitted')) {
        alert('You have already submitted feedback for this course and faculty combination. You can only submit feedback once.');
      } else {
        alert(error?.message || 'Error submitting feedback. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Student Feedback Form</h1>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Available Feedback Forms</h2>
              <p className="text-sm text-gray-500">Forms fetched from the backend will appear here.</p>
            </div>
          </div>
          {formsLoading ? (
            <p className="text-sm text-gray-500">Loading forms...</p>
          ) : formsError ? (
            <p className="text-sm text-red-500">{formsError}</p>
          ) : forms.length === 0 ? (
            <p className="text-sm text-gray-500">No forms are currently available.</p>
          ) : (
            <div className="grid gap-4">
              {forms.map((form) => (
                <div key={form.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{form.title}</h3>
                    <span className="text-xs text-gray-500">{form.questions?.length || 0} questions</span>
                  </div>
                  {form.description && <p className="text-sm text-gray-600 mb-2">{form.description}</p>}
                  {form.facultyName && <p className="text-sm text-gray-600">Faculty: {form.facultyName}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Name/ID</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              disabled={user?.role === 'STUDENT'}
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${user?.role === 'STUDENT' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder={user?.role === 'STUDENT' ? 'Auto-filled from your account' : 'Enter student name'}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course ID</label>
              <input
                type="text"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., CS101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Course Name</label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Data Structures"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Faculty Name</label>
              <input
                type="text"
                name="facultyName"
                value={formData.facultyName}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Dr. Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Section</label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., A"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <input
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 2025-2026"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Below Average</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Optional feedback..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default StudentFeedback;