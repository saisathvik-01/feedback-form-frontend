import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">Feedback System</h2>
      </div>
      <nav className="mt-6">
        <Link to="/" className="block px-6 py-3 text-gray-700 hover:bg-gray-200">Dashboard</Link>
        <Link to="/feedback" className="block px-6 py-3 text-gray-700 hover:bg-gray-200">Feedback Form</Link>
        <Link to="/submitted" className="block px-6 py-3 text-gray-700 hover:bg-gray-200">Submitted Feedback</Link>
        <Link to="/analytics" className="block px-6 py-3 text-gray-700 hover:bg-gray-200">Analytics</Link>
      </nav>
    </div>
  );
};

export default Sidebar;