import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FeedbackForm from './pages/FeedbackForm';
import Analytics from './pages/Analytics';
import CreateForm from './pages/CreateForm';
import Navbar from './components/Navbar';

function App() {
  const [auth, setAuth] = useState(null);

  const handleLogin = (email, password, role, name, id) => {
    // simple stub that marks user as logged in
    const user = { email, password, role, name, id, isLoggedIn: true };
    setAuth(user);
    return true; // indicate success to caller
  };

  const handleRegister = (name, id, email, password, role) => {
    const user = { name, id, email, password, role, isLoggedIn: true };
    setAuth(user);
    return true;
  };

  const handleLogout = () => {
    setAuth(null);
  };

  return (
    <BrowserRouter>
      <Navbar auth={auth} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/student" element={<StudentDashboard auth={auth} />} />
        <Route path="/admin" element={<AdminDashboard auth={auth} />} />
        <Route path="/form" element={<FeedbackForm auth={auth} />} />
        <Route path="/analytics" element={<Analytics auth={auth} />} />
        <Route path="/create" element={<CreateForm auth={auth} />} />
        {/* fallback to login for any unknown path */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
