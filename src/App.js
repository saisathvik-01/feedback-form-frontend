import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FeedbackForm from './pages/FeedbackForm';
import Analytics from './pages/Analytics';

function App() {
  const [auth, setAuth] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentDashboard auth={auth} />} />
        <Route path="/admin" element={<AdminDashboard auth={auth} />} />
        <Route path="/form" element={<FeedbackForm auth={auth} />} />
        <Route path="/analytics" element={<Analytics auth={auth} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
