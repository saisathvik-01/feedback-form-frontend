import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Card,
  Grid,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { getAnalyticsFaculty, getAnalyticsSatisfaction, getAnalyticsTrend, getFeedback, downloadFeedbackCsv } from '../utils/api';

const Analytics = () => {
  const [facultyRatings, setFacultyRatings] = useState([]);
  const [satisfaction, setSatisfaction] = useState({ poor: 0, average: 0, good: 0 });
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({
    course: '',
    faculty: '',
    section: '',
    semester: '',
    academicYear: ''
  });
  const [filterOptions, setFilterOptions] = useState({
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
    loadAnalytics();
  }, [loadAnalytics]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const allFeedback = await getFeedback();
        const unique = (items) => [...new Set(items.filter(Boolean))].sort();
        setFilterOptions({
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

    loadFilters();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ course: '', faculty: '', section: '', semester: '', academicYear: '' });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const csv = await downloadFeedbackCsv(filters);
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
      console.error('Unable to export feedback:', error);
      alert(error?.message || 'Unable to export feedback right now.');
    } finally {
      setExporting(false);
    }
  };

  const instructorData = facultyRatings.map(item => ({ faculty: item.faculty, average: item.avgRating }));
  const satisfactionData = [
    { name: 'Poor', value: satisfaction.poor, color: '#ef4444' },
    { name: 'Average', value: satisfaction.average, color: '#f59e0b' },
    { name: 'Good', value: satisfaction.good, color: '#10b981' }
  ];
  const trendData = trend.map((item, index) => ({ ...item, index: index + 1 }));

  return (
    <Box sx={{ background: '#f4f6fb', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', mb: 4, gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
              Analytics Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: '#4b5563', mt: 1 }}>
              Filter feedback results by course, faculty, section, semester or academic year.
            </Typography>
          </Box>
          <Button variant="contained" color="primary" onClick={handleExport} disabled={exporting || loading}>
            {exporting ? 'Downloading...' : 'Export Feedback CSV'}
          </Button>
        </Box>

        <Card sx={{ mb: 4, p: 3, boxShadow: '0 4px 18px rgba(15, 23, 42, 0.08)' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select name="course" value={filters.course} label="Course" onChange={handleFilterChange}>
                  <MenuItem value="">All courses</MenuItem>
                  {filterOptions.courses.map(course => (
                    <MenuItem key={course} value={course}>{course}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Faculty</InputLabel>
                <Select name="faculty" value={filters.faculty} label="Faculty" onChange={handleFilterChange}>
                  <MenuItem value="">All faculty</MenuItem>
                  {filterOptions.faculties.map(faculty => (
                    <MenuItem key={faculty} value={faculty}>{faculty}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Section</InputLabel>
                <Select name="section" value={filters.section} label="Section" onChange={handleFilterChange}>
                  <MenuItem value="">All sections</MenuItem>
                  {filterOptions.sections.map(section => (
                    <MenuItem key={section} value={section}>{section}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Semester</InputLabel>
                <Select name="semester" value={filters.semester} label="Semester" onChange={handleFilterChange}>
                  <MenuItem value="">All semesters</MenuItem>
                  {filterOptions.semesters.map(semester => (
                    <MenuItem key={semester} value={semester}>{semester}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Academic Year</InputLabel>
                <Select name="academicYear" value={filters.academicYear} label="Academic Year" onChange={handleFilterChange}>
                  <MenuItem value="">All years</MenuItem>
                  {filterOptions.academicYears.map(year => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button variant="outlined" color="secondary" fullWidth onClick={handleResetFilters}>
                Reset filters
              </Button>
            </Grid>
          </Grid>
        </Card>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 16 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Card sx={{ p: 3, boxShadow: '0 4px 18px rgba(15, 23, 42, 0.08)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Instructor Ratings
                </Typography>
                {instructorData.length > 0 ? (
                  <BarChart width={500} height={320} data={instructorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="faculty" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average" fill="#2563eb" />
                  </BarChart>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320, color: '#6b7280' }}>
                    No instructor analytics available
                  </Box>
                )}
              </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Card sx={{ p: 3, boxShadow: '0 4px 18px rgba(15, 23, 42, 0.08)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Satisfaction Distribution
                </Typography>
                {satisfactionData.some(item => item.value > 0) ? (
                  <PieChart width={500} height={320}>
                    <Pie
                      data={satisfactionData}
                      cx={250}
                      cy={160}
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {satisfactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320, color: '#6b7280' }}>
                    No satisfaction data to display
                  </Box>
                )}
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ p: 3, boxShadow: '0 4px 18px rgba(15, 23, 42, 0.08)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Submission Trend
                </Typography>
                {trendData.length > 0 ? (
                  <LineChart width={1000} height={360} data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="index" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgRating" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360, color: '#6b7280' }}>
                    No trend data available
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Analytics;
