import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { getFeedback, downloadFeedbackCsv } from '../utils/api';

const SubmittedFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const data = await getFeedback();
        setFeedbacks(data);
      } catch (error) {
        console.error('Error loading feedback:', error);
        setError(error?.message || 'Unable to load feedback records.');
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  useEffect(() => {
    let filtered = feedbacks;
    if (search) {
      filtered = filtered.filter(f =>
        (f.studentName || '').toLowerCase().includes(search.toLowerCase()) ||
        (f.courseName || '').toLowerCase().includes(search.toLowerCase()) ||
        (f.facultyName || '').toLowerCase().includes(search.toLowerCase()) ||
        (f.section || '').toLowerCase().includes(search.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      const aRating = Number(a.rating || 0);
      const bRating = Number(b.rating || 0);
      return bRating - aRating;
    });
    setFilteredFeedbacks(filtered);
  }, [feedbacks, search]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const csv = await downloadFeedbackCsv();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'feedback_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert(error?.message || 'Unable to export feedback at this time.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Submitted Feedback</h1>
            <p className="text-sm text-gray-500 mt-1">Export and filter the most recent feedback records.</p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting || feedbacks.length === 0 || loading}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-4 text-red-700">
            {error}
          </div>
        )}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Search by name, course, faculty, section"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Student Name</th>
                <th className="py-2 px-4 border-b">Course</th>
                <th className="py-2 px-4 border-b">Faculty</th>
                <th className="py-2 px-4 border-b">Section</th>
                <th className="py-2 px-4 border-b">Rating</th>
                <th className="py-2 px-4 border-b">Comment</th>
                <th className="py-2 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    {Array.from({ length: 7 }).map((__, cellIndex) => (
                      <td key={cellIndex} className="py-4 px-4 border-b">
                        <div className="h-4 bg-slate-200 rounded-md" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map(f => (
                  <tr key={f.id}>
                    <td className="py-2 px-4 border-b">{f.studentName}</td>
                    <td className="py-2 px-4 border-b">{f.courseName}</td>
                    <td className="py-2 px-4 border-b">{f.facultyName}</td>
                    <td className="py-2 px-4 border-b">{f.section}</td>
                    <td className="py-2 px-4 border-b">{f.rating}</td>
                    <td className="py-2 px-4 border-b">{f.comment}</td>
                    <td className="py-2 px-4 border-b">{new Date(f.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No feedback found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SubmittedFeedback;