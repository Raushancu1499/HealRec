import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Appointments from './pages/Appointments';
import MedicineHistory from './pages/MedicineHistory';
import LabPortal from './pages/LabPortal';
import HealthTracking from './pages/HealthTracking';
import MedicationManagement from './pages/MedicationManagement';
import Telemedicine from './pages/Telemedicine';
import Emergency from './pages/Emergency';
import HealthInsights from './pages/HealthInsights';
import FamilyManagement from './pages/FamilyManagement';
import FindDoctor from './pages/FindDoctor';
import Messages from './pages/Messages';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import UserManagement from './pages/Admin/UserManagement';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  // Role-based access guard
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div className="flex min-h-screen">
      <div className="mesh-gradient"></div>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navigation />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
      
      {/* Landing - redirect to dashboard if logged in */}
      <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />

      {/* Protected Routes - All roles */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

      {/* Patient + Doctor routes */}
      <Route path="/health-tracking" element={<ProtectedRoute roles={['Patient', 'Doctor']}><HealthTracking /></ProtectedRoute>} />
      <Route path="/telemedicine" element={<ProtectedRoute roles={['Patient', 'Doctor']}><Telemedicine /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute roles={['Patient', 'Doctor']}><Appointments /></ProtectedRoute>} />
      <Route path="/health-insights" element={<ProtectedRoute roles={['Patient', 'Doctor']}><HealthInsights /></ProtectedRoute>} />

      {/* Patient-only routes */}
      <Route path="/reports" element={<ProtectedRoute roles={['Patient', 'Admin']}><Reports /></ProtectedRoute>} />
      <Route path="/medication-management" element={<ProtectedRoute roles={['Patient']}><MedicationManagement /></ProtectedRoute>} />
      <Route path="/medicine" element={<ProtectedRoute roles={['Patient']}><MedicineHistory /></ProtectedRoute>} />
      <Route path="/find-doctor" element={<ProtectedRoute roles={['Patient']}><FindDoctor /></ProtectedRoute>} />
      <Route path="/family-management" element={<ProtectedRoute roles={['Patient']}><FamilyManagement /></ProtectedRoute>} />

      {/* Lab + Admin routes */}
      <Route path="/lab-portal" element={<ProtectedRoute roles={['Lab', 'Admin']}><LabPortal /></ProtectedRoute>} />

      {/* Admin-only: dedicated user management */}
      <Route path="/users" element={<ProtectedRoute roles={['Admin']}><UserManagement /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
