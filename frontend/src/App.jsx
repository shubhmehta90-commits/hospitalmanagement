import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import RecordsPage from './pages/RecordsPage';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import PharmacyPage from './pages/PharmacyPage';
import LabsPage from './pages/LabsPage';
import BillingPage from './pages/BillingPage';

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  return currentUser ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen" style={{ 
        display: 'flex', 
        height: '100vh', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-dark)',
        color: 'var(--text-primary)'
      }}>
        <div className="spinner" style={{ marginRight: 12 }} />
        Initializing System...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!currentUser ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        
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
        <Route path="/patients" element={
          <PrivateRoute>
            <PatientsPage />
          </PrivateRoute>
        } />
        <Route path="/doctors" element={
          <PrivateRoute>
            <DoctorsPage />
          </PrivateRoute>
        } />
        <Route path="/pharmacy" element={
          <PrivateRoute>
            <PharmacyPage />
          </PrivateRoute>
        } />
        <Route path="/labs" element={
          <PrivateRoute>
            <LabsPage />
          </PrivateRoute>
        } />
        <Route path="/billing" element={
          <PrivateRoute>
            <BillingPage />
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
