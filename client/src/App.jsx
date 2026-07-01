import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

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
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <p style={{ fontWeight: 500, color: 'var(--color-body)' }}>Loading session...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
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

          {/* Dashboard / Volunteer Portal Routes (Protected) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="profile/setup" element={<ProfileSetup />} />
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
