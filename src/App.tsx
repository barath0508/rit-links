import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) => {
  const { currentUser, userRole, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === 'student' ? '/student/dashboard' : '/faculty/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Student routes */}
      <Route 
        path="/student/*" 
        element={
          <ProtectedRoute requiredRole="student">
            <Routes>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
            </Routes>
          </ProtectedRoute>
        } 
      />
      
      {/* Faculty routes */}
      <Route 
        path="/faculty/*" 
        element={
          <ProtectedRoute requiredRole="faculty">
            <Routes>
              <Route path="dashboard" element={<FacultyDashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/faculty/dashboard" replace />} />
            </Routes>
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;