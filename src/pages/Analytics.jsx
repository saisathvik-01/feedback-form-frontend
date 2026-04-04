import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { getAnalyticsFaculty, getAnalyticsSatisfaction, getAnalyticsTrend, getFeedback } from '../utils/api';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-900 dark:text-slate-100 shadow-lg">
      {label && <div className="font-semibold mb-2">{label}</div>}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 py-1">
          <span className="text-gray-600 dark:text-slate-300">{entry.name}</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const Analytics = () => {
  const [facultyRatings, setFacultyRatings] = useState([]);
  const [satisfaction, setSatisfaction] = useState({ poor: 0, average: 0, good: 0 });
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    course: '',
    faculty: '',
    section: '',
    semester: '',
    academicYear: ''
  });
  const [feedbackOptions, setFeedbackOptions] = useState({
    courses: [],
    faculties: [],
    sections: [],
    semesters: [],
    academicYears: []
  });

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const [facultyData, satisfactionData, trendData] = await Promise.all([
        getAnalyticsFaculty(filters),
        getAnalyticsSatisfaction(filters),
        getAnalyticsTrend(filters)
      ]);
      setFacultyRatings(facultyData);
      setSatisfaction(satisfactionData);
      setTrend(trendData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const allFeedback = await getFeedback();
        const unique = (items) => [...new Set(items.filter(Boolean))].sort();

        setFeedbackOptions({
          courses: unique(allFeedback.map(item => item.courseName)),
          faculties: unique(allFeedback.map(item => item.facultyName)),
          sections: unique(allFeedback.map(item => item.section)),
          semesters: unique(allFeedback.map(item => item.semester)),
          academicYears: unique(allFeedback.map(item => item.academicYear))
        });
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    const handleRefresh = () => loadAnalytics();
    window.addEventListener('feedbackSubmitted', handleRefresh);
    return () => window.removeEventListener('feedbackSubmitted', handleRefresh);
  }, [loadAnalytics]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const instructorData = facultyRatings.map(item => ({
    faculty: item.faculty,
    average: item.avgRating
  }));

  const satisfactionData = [
    { name: 'Poor', value: satisfaction.poor, color: '#ef4444' },
    { name: 'Average', value: satisfaction.average, color: '#f59e0b' },
    { name: 'Good', value: satisfaction.good, color: '#10b981' }
  ];

  const trendData = trend.map((item, index) => ({
    ...item,
    index: index + 1
  }));

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading analytics...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Analytics</h1>

        <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select
                name="course"
                value={filters.course}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All courses</option>
                {feedbackOptions.courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
              <select
                name="faculty"
                value={filters.faculty}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All faculty</option>
                {feedbackOptions.faculties.map(faculty => (
                  <option key={faculty} value={faculty}>{faculty}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                name="section"
                value={filters.section}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All sections</option>
                {feedbackOptions.sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                name="semester"
                value={filters.semester}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All semesters</option>
                {feedbackOptions.semesters.map(semester => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <select
                name="academicYear"
                value={filters.academicYear}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All years</option>
                {feedbackOptions.academicYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setFilters({ course: '', faculty: '', section: '', semester: '', academicYear: '' })}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition"
            >
              Reset filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Instructor Ratings</h2>
            {instructorData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={instructorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="faculty" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(59,130,246,0.06)' }} />
                  <Legend />
                  <Bar dataKey="average" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-slate-400">
                No data available
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Satisfaction Distribution</h2>
            {satisfactionData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-slate-400">
                No data available
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Rating Trend</h2>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="index" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip content={<ChartTooltip />} formatter={(value) => value} labelFormatter={(value) => `Submission ${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="avgRating" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-slate-400">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;