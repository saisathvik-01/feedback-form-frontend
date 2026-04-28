const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const getToken = () => localStorage.getItem('token');

const logout = (message) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  if (message) {
    localStorage.setItem('authError', message);
  }
  window.location.href = '/login';
};

const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const buildHeaders = (options = {}) => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  ...getAuthHeaders(),
  ...options.headers,
});

const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};

const logApiError = (input, init, error) => {
  console.error('[API] Request failed', {
    url: input,
    method: init?.method || 'GET',
    headers: init?.headers,
    body: init?.body,
    error
  });
};

const cacheTTL = 1000 * 60;
const apiCache = new Map();
const pendingRequests = new Map();

const buildCacheKey = (input, init) => {
  const url = typeof input === 'string' ? input : input.url;
  const method = init?.method?.toUpperCase() || 'GET';
  const body = init?.body || '';
  return `${method}:${url}:${body}`;
};

const handleResponse = async (response) => {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body?.message || body?.error || response.statusText || 'Request failed';
    const errorText = `${response.status} ${message}`;
    if (response.status === 401) {
      if (isTokenExpired() || !getToken()) {
        logout('Session expired. Please log in again.');
        throw new Error('Session expired. Please log in again.');
      }
      // Token is valid but request returned 401 (permission issue)
      throw new Error('Unauthorized. Please log in again.');
    }
    if (response.status === 403) {
      throw new Error('Access denied. Insufficient permissions.');
    }
    throw new Error(errorText);
  }
  return body;
};

const safeFetch = async (input, init = {}, expectText = false) => {
  const request = {
    ...init,
    headers: buildHeaders(init),
  };

  if (process.env.NODE_ENV !== 'production') {
    console.debug('[API] request', {
      url: input,
      method: request.method || 'GET',
      headers: request.headers,
      body: request.body,
      tokenPresent: !!getToken(),
      tokenSample: getToken()?.slice(0, 10) || null,
    });
  }

  try {
    const response = await fetch(input, request);
    if (expectText) {
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message = body?.message || body?.error || response.statusText || 'Request failed';
        if (response.status === 401) {
          console.warn('[API] 401 response', {
            url: input,
            status: response.status,
            statusText: response.statusText,
            tokenPresent: !!getToken(),
            tokenExpired: isTokenExpired(),
            responseBody: body,
          });
          if (isTokenExpired() || !getToken()) {
            logout('Session expired. Please log in again.');
            throw new Error('Session expired. Please log in again.');
          }
          throw new Error('Unauthorized. Please log in again.');
        }
        if (response.status === 403) {
          throw new Error('Access denied. Insufficient permissions.');
        }
        throw new Error(message);
      }
      return response.text();
    }
    return handleResponse(response);
  } catch (error) {
    logApiError(input, request, error);

    if (error instanceof TypeError) {
      const message = error.message || 'Network error. Please check your connection and try again.';
      throw new Error(`Network error: ${message}`);
    }
    throw error;
  }
}

export const apiCall = async (url, options = {}) => safeFetch(url, options);

const cachedFetch = async (input, init = {}, expectText = false) => {
  const method = init?.method?.toUpperCase() || 'GET';
  const shouldCache = method === 'GET' && !input.toString().includes('/export');
  if (!shouldCache) {
    return safeFetch(input, init, expectText);
  }

  const key = buildCacheKey(input, init);
  const now = Date.now();
  const cacheEntry = apiCache.get(key);
  if (cacheEntry && cacheEntry.expiresAt > now) {
    return cacheEntry.data;
  }

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const promise = safeFetch(input, init, expectText);
  pendingRequests.set(key, promise);

  try {
    const data = await promise;
    apiCache.set(key, { data, expiresAt: now + cacheTTL });
    return data;
  } finally {
    pendingRequests.delete(key);
  }
};

export const clearApiCache = () => {
  apiCache.clear();
};

export const login = async (identifier, password) => {
  return apiCall(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ identifier, password })
  });
};

export const signup = async (data) => {
  const payload = {
    ...data,
    role: data.role?.toUpperCase()
  };

  return apiCall(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const submitFeedback = async (feedback) => {
  const result = await apiCall(`${BASE_URL}/api/feedback`, {
    method: 'POST',
    body: JSON.stringify({
      courseId: feedback.courseId,
      courseName: feedback.courseName,
      facultyName: feedback.facultyName,
      semester: feedback.semester,
      academicYear: feedback.academicYear,
      rating: feedback.rating,
      comment: feedback.comment,
      ratings: feedback.ratings
    })
  });
  clearApiCache();
  return result;
};

export const getFeedback = async (filters = {}) => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  let url = `${BASE_URL}/api/feedback`;

  if (user.role === 'STUDENT') {
    url = `${BASE_URL}/api/feedback/my-feedback`;
  } else {
    const params = new URLSearchParams();
    if (filters.course) params.append('courseId', filters.course);
    if (filters.faculty) params.append('facultyName', filters.faculty);
    if (filters.section) params.append('section', filters.section);
    if (filters.semester) params.append('semester', filters.semester);
    if (filters.academicYear) params.append('academicYear', filters.academicYear);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
  }

  return cachedFetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

const getAnalyticsUrl = (endpoint, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.course) params.append('courseId', filters.course);
  if (filters.faculty) params.append('facultyName', filters.faculty);
  if (filters.section) params.append('section', filters.section);
  if (filters.semester) params.append('semester', filters.semester);
  if (filters.academicYear) params.append('academicYear', filters.academicYear);
  const queryString = params.toString();
  return `${BASE_URL}/api/analytics/${endpoint}${queryString ? `?${queryString}` : ''}`;
};

export const getAnalyticsFaculty = async (filters = {}) => {
  return cachedFetch(getAnalyticsUrl('faculty', filters), {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const getAnalyticsSatisfaction = async (filters = {}) => {
  return cachedFetch(getAnalyticsUrl('satisfaction', filters), {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const getAnalyticsTrend = async (filters = {}) => {
  return cachedFetch(getAnalyticsUrl('trend', filters), {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const getAnalyticsRatingDistribution = async (filters = {}) => {
  return cachedFetch(getAnalyticsUrl('rating-distribution', filters), {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const downloadFeedbackCsv = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.course) params.append('courseId', filters.course);
  if (filters.faculty) params.append('facultyName', filters.faculty);
  if (filters.section) params.append('section', filters.section);
  if (filters.semester) params.append('semester', filters.semester);
  if (filters.academicYear) params.append('academicYear', filters.academicYear);
  const queryString = params.toString();

  return safeFetch(`${BASE_URL}/api/feedback/export${queryString ? `?${queryString}` : ''}`, {
    method: 'GET',
    headers: getAuthHeaders()
  }, true);
};

export const getFacultySummary = async () => {
  return cachedFetch(`${BASE_URL}/api/feedback/faculty-summary`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const getDashboardSummary = async () => {
  return cachedFetch(`${BASE_URL}/api/feedback/dashboard-summary`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const getFeedbackStats = async (filters = {}) => {
  const feedback = await getFeedback(filters);
  const totalFeedback = feedback.length;
  const averageRating = totalFeedback > 0
    ? (feedback.reduce((sum, item) => sum + Number(item.rating || 0), 0) / totalFeedback).toFixed(1)
    : 0;
  const totalCourses = new Set(feedback.map(f => f.courseName)).size;
  const totalFaculty = new Set(feedback.map(f => f.facultyName)).size;

  return {
    totalFeedback,
    averageRating,
    totalCourses,
    totalFaculty
  };
};

// Form Builder API functions
export const createForm = async (formData) => {
  const result = await safeFetch(`${BASE_URL}/api/forms`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(formData)
  });
  clearApiCache();
  return result;
};

export const getAllForms = async () => {
  return cachedFetch(`${BASE_URL}/api/forms`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const getFormById = async (formId) => {
  return cachedFetch(`${BASE_URL}/api/forms/${formId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const updateForm = async (formId, formData) => {
  const result = await safeFetch(`${BASE_URL}/api/forms/${formId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(formData)
  });
  clearApiCache();
  return result;
};

export const deleteForm = async (formId) => {
  const result = await safeFetch(`${BASE_URL}/api/forms/${formId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  clearApiCache();
  return result;
};

// Course API functions
export const getAllCourses = async () => {
  return cachedFetch(`${BASE_URL}/api/courses`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const getCourseById = async (courseId) => {
  return cachedFetch(`${BASE_URL}/api/courses/${courseId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const getCourseByCourseNameWithForm = async (courseName) => {
  return cachedFetch(`${BASE_URL}/api/courses/by-name/${courseName}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const assignFormToCourse = async (courseId, formId) => {
  const result = await safeFetch(`${BASE_URL}/api/courses/${courseId}/assign-form/${formId}`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });
  clearApiCache();
  return result;
};

export const initializeDefaultCourses = async () => {
  const result = await safeFetch(`${BASE_URL}/api/courses/initialize`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  clearApiCache();
  return result;
};

// Response API functions
export const submitResponse = async (responseData) => {
  const result = await safeFetch(`${BASE_URL}/api/responses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(responseData)
  });
  clearApiCache();
  return result;
};

export const getStudentResponses = async () => {
  return cachedFetch(`${BASE_URL}/api/responses/student`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const getResponsesByCourse = async (courseId) => {
  return cachedFetch(`${BASE_URL}/api/responses/course/${courseId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const getResponsesByForm = async (formId) => {
  return cachedFetch(`${BASE_URL}/api/responses/form/${formId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const getResponsesByCourseAndForm = async (courseId, formId) => {
  return cachedFetch(`${BASE_URL}/api/responses/course/${courseId}/form/${formId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const checkStudentSubmission = async (courseId) => {
  return cachedFetch(`${BASE_URL}/api/responses/check/${courseId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

export const getAllResponses = async () => {
  return cachedFetch(`${BASE_URL}/api/responses`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
};

const api = {
  get: (url) => cachedFetch(`${BASE_URL}${url}`, { method: 'GET' }),
  post: (url, data) => apiCall(`${BASE_URL}${url}`, { method: 'POST', body: JSON.stringify(data) }),
  put: (url, data) => apiCall(`${BASE_URL}${url}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (url) => apiCall(`${BASE_URL}${url}`, { method: 'DELETE' })
};

export default api;
