import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '', // Can be username or email
    password: ''
  });
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  // Validation regexes
  const usernameRegex = /^\d{10}$/;
  const emailRegex = /^\d{10}@kluniversity\.in$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const validateForm = (identifier, password) => {
    let isValidForm = true;
    let errorMsg = '';

    // Check identifier (username or email)
    if (!usernameRegex.test(identifier) && !emailRegex.test(identifier)) {
      errorMsg = 'Enter valid Username (10-digit ID) or University Email';
      isValidForm = false;
    }

    // Check password
    if (!passwordRegex.test(password)) {
      if (errorMsg) errorMsg += ' and ';
      errorMsg += 'Password must be 8+ characters with uppercase, number, and special character';
      isValidForm = false;
    }

    setError(errorMsg);
    setIsValid(isValidForm);
    return isValidForm;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // Validate on change
    validateForm(newFormData.identifier, newFormData.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(formData.identifier, formData.password)) {
      return;
    }

    try {
      const authResponse = await login(formData.identifier, formData.password);
      const storedUser = {
        id: authResponse.id,
        username: authResponse.username,
        email: authResponse.email,
        role: authResponse.role,
        facultyName: authResponse.facultyName,
        section: authResponse.section
      };

      localStorage.setItem('token', authResponse.token);
      localStorage.setItem('user', JSON.stringify(storedUser));

      if (storedUser.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/feedback');
      }
    } catch (error) {
      setError(error?.message || 'Invalid credentials. Please check your username/email and password.');
      setIsValid(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Use your 10-digit Student ID or University Email
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                Student ID or University Email
              </label>
              <div className="mt-1">
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="e.g., 2400032267 or 2400032267@kluniversity.in"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
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
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters with uppercase, number, special char"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                {error}
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
                Sign in
              </button>
            </div>

            <div className="text-center">
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;