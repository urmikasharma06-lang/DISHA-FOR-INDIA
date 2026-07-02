import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VolunteerProvider } from './context/VolunteerContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Programs from './pages/Programs';
import Leaderboard from './pages/Leaderboard';
import Certificates from './pages/Certificates';
import ProfileSetup from './pages/ProfileSetup';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Volunteer Pages
import ApplicationForm from './pages/applications/ApplicationForm';
import MyApplications from './pages/applications/MyApplications';
import ApplicationDetails from './pages/applications/ApplicationDetails';
import MyPrograms from './pages/programs/MyPrograms';
import AttendanceDashboard from './pages/attendance/AttendanceDashboard';
import CheckIn from './pages/attendance/CheckIn';
import CheckOut from './pages/attendance/CheckOut';
import AttendanceHistory from './pages/attendance/AttendanceHistory';
import VolunteerHours from './pages/attendance/VolunteerHours';

// Admin Pages
import AdminApplications from './pages/admin/AdminApplications';
import AdminAttendance from './pages/admin/AdminAttendance';

// ─── ROUTE GUARDS ─────────────────────────────────────────────

// Guard: Require Authentication
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)'
      }}>
        {/* Loading Spinner */}
        <div className="spinner" style={{ marginBottom: '1rem' }}></div>
        <p style={{ fontWeight: 500, color: 'var(--color-body)' }}>Loading session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Guard: Require Admin Role
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Assuming user object has a role property 'admin'
  if (!user || user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Guard: Redirect Authenticated Users (e.g. Login, Register)
const RedirectIfAuthenticated = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // Wait for session load

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// ─── MAIN APP ROUTER ───────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes (Header/Footer present) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="programs" element={<Programs />} />
            <Route path="leaderboard" element={<Leaderboard />} />
          </Route>

          {/* Auth Routes (Separate minimalistic layout) */}
          <Route path="/" element={<AuthLayout />}>
            <Route
              path="login"
              element={
                <RedirectIfAuthenticated>
                  <Login />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="register"
              element={
                <RedirectIfAuthenticated>
                  <Register />
                </RedirectIfAuthenticated>
              }
            />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Dashboard / Volunteer Portal Routes (Protected) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <VolunteerProvider>
                  <DashboardLayout />
                </VolunteerProvider>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="profile/setup" element={<ProfileSetup />} />
            
            {/* Volunteer Journey Routes */}
            <Route path="applications" element={<MyApplications />} />
            <Route path="applications/:id" element={<ApplicationDetails />} />
            <Route path="programs/:programId/apply" element={<ApplicationForm />} />
            <Route path="my-programs" element={<MyPrograms />} />
            
            {/* Attendance & Hours Routes */}
            <Route path="attendance" element={<AttendanceDashboard />} />
            <Route path="attendance/check-in" element={<CheckIn />} />
            <Route path="attendance/checkout" element={<CheckOut />} />
            <Route path="attendance/history" element={<AttendanceHistory />} />
            <Route path="attendance/hours" element={<VolunteerHours />} />
            
            {/* Admin Routes */}
            <Route path="admin/applications" element={<AdminRoute><AdminApplications /></AdminRoute>} />
            <Route path="admin/attendance" element={<AdminRoute><AdminAttendance /></AdminRoute>} />
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<MainLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
