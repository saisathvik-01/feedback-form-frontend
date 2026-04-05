import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../utils/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    facultyName: '',
    section: ''
  });
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  // Validation regexes
  const usernameRegex = /^\d{10}$/;
  const emailRegex = /^\d{10}@kluniversity\.in$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const validateField = (name, value, currentData = formData) => {
    let error = '';
    const nextData = { ...currentData, [name]: value };

    switch (name) {
      case 'username':
        if (!usernameRegex.test(value)) {
          error = 'Username must be exactly 10 digits';
        }
        break;
      case 'email':
        if (!emailRegex.test(value)) {
          error = 'Email must be in format: 1234567890@kluniversity.in';
        }
        break;
      case 'password':
        if (!passwordRegex.test(value)) {
          error = 'Password must be 8+ characters with uppercase, number, and special character';
        }
        if (nextData.confirmPassword && nextData.confirmPassword !== value) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        }
        break;
      case 'confirmPassword':
        if (value !== nextData.password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = (currentData = formData) => {
    const newErrors = {};
    let isFormValid = true;

    // Validate username
    if (!usernameRegex.test(currentData.username)) {
      newErrors.username = 'Username must be exactly 10 digits';
      isFormValid = false;
    }

    // Validate email
    if (!emailRegex.test(currentData.email)) {
      newErrors.email = 'Email must be in format: 1234567890@kluniversity.in';
      isFormValid = false;
    }

    // Validate password
    if (!passwordRegex.test(currentData.password)) {
      newErrors.password = 'Password must be 8+ characters with uppercase, number, and special character';
      isFormValid = false;
    }

    // Validate confirm password
    if (currentData.password !== currentData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isFormValid = false;
    }

    setErrors(newErrors);
    setIsValid(isFormValid);
    return isFormValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    // Validate field on change with the latest values
    validateField(name, value, nextFormData);

    // Re-validate entire form using updated values
    setTimeout(() => validateForm(nextFormData), 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        facultyName: formData.facultyName,
        section: formData.section
      });
      navigate('/login');
    } catch (error) {
      setErrors({ form: error?.message || 'Failed to create account. Please try again.' });
      setIsValid(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Register with your university credentials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Student ID (Username)
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter 10-digit Student ID"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                University Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., 2400032267@kluniversity.in"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters with uppercase, number, special char"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {formData.role === 'FACULTY' && (
              <>
                <div>
                  <label htmlFor="facultyName" className="block text-sm font-medium text-gray-700">
                    Faculty Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="facultyName"
                      name="facultyName"
                      type="text"
                      value={formData.facultyName}
                      onChange={handleChange}
                      placeholder="e.g., Dr. Smith"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="section" className="block text-sm font-medium text-gray-700">
                    Section
                  </label>
                  <div className="mt-1">
                    <input
                      id="section"
                      name="section"
                      type="text"
                      value={formData.section}
                      onChange={handleChange}
                      placeholder="e.g., A"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {errors.form && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                {errors.form}
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={!isValid}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isValid
                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    : 'bg-gray-400 cursor-not-allowed'
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                Sign up
              </button>
            </div>

            <div className="text-center">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;