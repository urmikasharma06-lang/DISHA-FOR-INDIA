import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Sun, Moon, Menu, X, LogOut, LayoutDashboard, Calendar, Trophy } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize Dark Mode state based on body class or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.body.classList.add('dark-mode');
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Programs', path: '/programs' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 'var(--navbar-height)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      transition: 'var(--transition-normal)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
          <span style={{
            display: 'flex',
            padding: '0.45rem',
            borderRadius: '8px',
            background: 'var(--gradient-primary)',
            color: '#ffffff',
            boxShadow: 'var(--gradient-glow)'
          }}>
            <Shield size={20} />
          </span>
          DISHA FOR INDIA
        </Link>

        {/* Desktop Links & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                style={{
                  fontWeight: 600,
                  fontSize: '0.925rem',
                  color: isActive(link.path) ? 'var(--color-primary)' : 'var(--color-heading)',
                  opacity: isActive(link.path) ? 1 : 0.85,
                  padding: '0.25rem 0',
                  borderBottom: isActive(link.path) ? '2px solid var(--color-primary)' : '2px solid transparent',
                  transition: 'var(--transition-fast)'
                }}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard"
                style={{
                  fontWeight: 600,
                  fontSize: '0.925rem',
                  color: isActive('/dashboard') ? 'var(--color-primary)' : 'var(--color-heading)',
                  opacity: isActive('/dashboard') ? 1 : 0.85,
                  padding: '0.25rem 0',
                  borderBottom: isActive('/dashboard') ? '2px solid var(--color-primary)' : '2px solid transparent',
                  transition: 'var(--transition-fast)'
                }}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Vertical Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }}></div>

          {/* Theme Toggle & Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={toggleDarkMode}
              style={{
                padding: '0.5rem',
                borderRadius: '50%',
                color: 'var(--color-heading)',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-fast)'
              }}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} style={{ color: '#F59E0B' }} /> : <Moon size={18} />}
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ display: 'flex', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
              >
                <LogOut size={14} /> Log Out
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <div style={{ display: 'none' }} className="mobile-toggle">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={toggleDarkMode}
              style={{
                padding: '0.4rem',
                borderRadius: '50%',
                color: 'var(--color-heading)',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)'
              }}
            >
              {isDarkMode ? <Sun size={16} style={{ color: '#F59E0B' }} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              style={{ color: 'var(--color-heading)', padding: '0.25rem' }}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Drawer menu overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex' }}>
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}
          />
          
          {/* Menu Panel */}
          <div style={{
            position: 'relative',
            width: '280px',
            marginLeft: 'auto',
            backgroundColor: 'var(--color-card)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-xl)',
            padding: '1.5rem',
            animation: 'slideIn 0.3s ease-out forwards'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>DFI NAVIGATION</span>
              <button onClick={() => setMobileOpen(false)} style={{ color: 'var(--color-heading)' }}>
                <X size={24} />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    color: isActive(link.path) ? 'var(--color-primary)' : 'var(--color-heading)',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    color: isActive('/dashboard') ? 'var(--color-primary)' : 'var(--color-heading)',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              )}
            </nav>

            <div style={{ marginTop: 'auto' }}>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="btn btn-danger"
                  style={{ width: '100%', display: 'flex', gap: '0.5rem' }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Responsive Inline Styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
