import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import RecordsPage from './pages/RecordsPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        
        {/* Private Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        <Route path="/appointments" element={
          <PrivateRoute>
            <AppointmentsPage />
          </PrivateRoute>
        } />
        <Route path="/records" element={
          <PrivateRoute>
            <RecordsPage />
          </PrivateRoute>
        } />
        
        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
