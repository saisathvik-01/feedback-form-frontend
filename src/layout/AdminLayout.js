import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const getPreferredTheme = () => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) return storedTheme;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [theme, setTheme] = useState(getPreferredTheme());

  useEffect(() => {
    const activeTheme = getPreferredTheme();
    setTheme(activeTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Get available routes based on user role
  const getNavItems = () => {
    const baseItems = [
      { path: '/feedback', label: 'Feedback Form', roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
      { path: '/analytics', label: 'Analytics', roles: ['ADMIN', 'FACULTY'] }
    ];

    if (user?.role === 'ADMIN') {
      baseItems.unshift(
        { path: '/admin', label: 'Dashboard', roles: ['ADMIN'] },
        { path: '/submitted', label: 'Submitted Feedback', roles: ['ADMIN'] }
      );
    }

    return baseItems.filter(item => item.roles.includes(user?.role));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 dark:bg-slate-900 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Feedback System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100 px-3 py-2 rounded-md text-sm font-medium border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <div className="flex items-center space-x-2">
                <div className="text-sm">
                  <p className="text-gray-900 dark:text-slate-100 font-medium">
                    {user?.role === 'STUDENT' ? user?.username : user?.email}
                  </p>
                  <p className="text-gray-500 dark:text-slate-400 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-blue-800 text-white min-h-screen shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Navigation</h2>

            <nav className="space-y-3">
              {getNavItems().map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block p-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-600 shadow-md transform scale-105'
                      : 'hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;