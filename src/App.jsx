import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MemberDashboard from './pages/member/MemberDashboard';
import ClassDetails from './pages/member/ClassDetails';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { useState } from 'react';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('fitbook-theme') || 'dark');

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('fitbook-theme', nextTheme);
      return nextTheme;
    });
  };

  return (
    <AuthProvider>
      <Router>
        <div className={`${theme === 'light' ? 'theme-light' : ''} min-h-screen bg-brand-dark text-slate-100 fitbook-grid`}>
          <Navbar theme={theme} onToggleTheme={toggleTheme} />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['member', 'trainer', 'admin']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/member"
                element={
                  <ProtectedRoute allowedRoles={['member']}>
                    <MemberDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/classes/:id"
                element={
                  <ProtectedRoute allowedRoles={['member', 'admin']}>
                    <ClassDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trainer"
                element={
                  <ProtectedRoute allowedRoles={['trainer']}>
                    <TrainerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
