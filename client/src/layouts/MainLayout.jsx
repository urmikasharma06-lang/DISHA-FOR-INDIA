import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, Menu } from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <header className="glass" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 'var(--navbar-height)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
            <span style={{
              display: 'flex',
              padding: '0.4rem',
              borderRadius: '8px',
              background: 'var(--gradient-primary)',
              color: '#ffffff'
            }}>
              <Shield size={20} />
            </span>
            DISHA FOR INDIA
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/" style={{ fontWeight: 500, color: 'var(--color-heading)' }}>Home</Link>
            <Link to="/programs" style={{ fontWeight: 500, color: 'var(--color-heading)' }}>Programs</Link>
            <Link to="/leaderboard" style={{ fontWeight: 500, color: 'var(--color-heading)' }}>Leaderboard</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" style={{ fontWeight: 500, color: 'var(--color-heading)' }}>Dashboard</Link>
                <button
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--color-error)' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#0F172A',
        color: '#ffffff',
        padding: '3rem 1.5rem',
        marginTop: 'auto'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>DISHA FOR INDIA</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>
              Building a modern digital movement for social change.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
            <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Home</Link>
            <Link to="/programs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Programs</Link>
            <Link to="/leaderboard" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Leaderboard</Link>
          </div>
        </div>
        <div className="container" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '2rem', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)' }}>
          © {new Date().getFullYear()} Disha for India. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
