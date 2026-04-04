import React, { useState, useEffect } from 'react';

const Dashboard = ({ role, facultyData }) => {
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageRating: 0,
    totalCourses: 0,
    totalFaculty: 0
  });

  useEffect(() => {
    const feedbacks = JSON.parse(localStorage.getItem('feedback')) || [];
    let filtered = feedbacks;
    if (role === 'faculty') {
      filtered = feedbacks.filter(f =>
        f.faculty === facultyData.name && f.section === facultyData.section
      );
    }
    const totalFeedback = filtered.length;
    const averageRating = totalFeedback > 0 ? (filtered.reduce((sum, f) => sum + f.rating, 0) / totalFeedback).toFixed(2) : 0;
    const courses = new Set(filtered.map(f => f.course)).size;
    const faculty = new Set(filtered.map(f => f.faculty)).size;
    setStats({
      totalFeedback,
      averageRating,
      totalCourses: courses,
      totalFaculty: faculty
    });
  }, [role, facultyData]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Total Feedback</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalFeedback}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Average Rating</h2>
          <p className="text-3xl font-bold text-green-600">{stats.averageRating}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Total Courses</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.totalCourses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Total Faculty</h2>
          <p className="text-3xl font-bold text-red-600">{stats.totalFaculty}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;