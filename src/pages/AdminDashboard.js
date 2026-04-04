import React, { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getDashboardSummary } from "../utils/api";
import { Alert, Skeleton } from '@mui/material';

const StatCard = ({ title, value, loading, children }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md min-h-[120px]">
    <h3 className="text-gray-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
    {loading ? (
      <Skeleton width="60%" height={36} />
    ) : (
      <>
        <p className="text-3xl font-bold text-blue-600 dark:text-sky-400 mt-2">{value}</p>
        {children}
      </>
    )}
  </div>
);

const TopFacultyCard = ({ faculty, rating, loading }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md min-h-[120px]">
    <h3 className="text-gray-500 dark:text-slate-400 text-sm font-medium">Top Faculty</h3>
    {loading ? (
      <Skeleton width="70%" height={36} />
    ) : (
      <div className="mt-2">
        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{faculty || 'N/A'}</p>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Average rating: {rating?.toFixed ? rating.toFixed(1) : rating || 'N/A'}</p>
      </div>
    )}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageRating: 0,
    totalCourses: 0,
    totalFaculty: 0,
    topFaculty: { name: 'N/A', rating: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardSummary();
        setStats({
          totalFeedback: data.totalFeedback,
          averageRating: data.averageRating,
          totalCourses: data.totalCourses ?? 0,
          totalFaculty: data.totalFaculty ?? 0,
          topFaculty: {
            name: data.topFaculty || 'N/A',
            rating: data.topFacultyRating ?? 0
          }
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        setError(error?.message || 'Unable to load dashboard summary.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Dashboard</h1>
          <p className="text-gray-500 dark:text-slate-400 max-w-2xl">
            A high-level summary of the feedback system and the top performing faculty.
          </p>
        </div>

        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Feedback" value={stats.totalFeedback} loading={loading} />
          <StatCard title="Average Rating" value={stats.averageRating} loading={loading} />
          <StatCard title="Total Courses" value={stats.totalCourses} loading={loading} />
          <TopFacultyCard
            faculty={stats.topFaculty.name}
            rating={stats.topFaculty.rating}
            loading={loading}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;