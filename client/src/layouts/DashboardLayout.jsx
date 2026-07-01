import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Home, Calendar, Award, Trophy, LogOut, Menu, X, User } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
    { name: 'Opportunities', path: '/programs', icon: <Calendar size={18} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={18} /> },
    { name: 'Certificates', path: '/certificates', icon: <Award size={18} /> },
  ];

  const profileName = user?.name || 'Volunteer';
  const profileLevel = user?.volunteerLevel || 'Beginner';
  const profilePoints = user?.points ?? 120;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* 1. Sidebar for Desktop */}
      <aside style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--color-card)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 90
      }} className="desktop-sidebar">
        {/* Header/Logo */}
        <div style={{
          height: 'var(--navbar-height)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
            <span style={{
              display: 'flex',
              padding: '0.35rem',
              borderRadius: '6px',
              background: 'var(--gradient-primary)',
              color: '#ffffff'
            }}>
              <Shield size={16} />
            </span>
            DFI VOLUNTEER
          </Link>
        </div>

        {/* User Mini Profile */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: '#F8FAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>
              {profileName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                {profileName}
              </h4>
              <span className="badge badge-blue" style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem', marginTop: '0.2rem' }}>
                {profileLevel}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-body)' }}>
            <span>Score:</span>
            <strong style={{ color: 'var(--color-primary)' }}>{profilePoints} pts</strong>
          </div>
        </div>

        {/* Links Navigation */}
        <nav style={{ flex: 1, padding: '1.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-body)',
                  backgroundColor: isActive ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'var(--transition-fast)'
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Bottom Section */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-error)',
              fontWeight: 600,
              textAlign: 'left'
            }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div style={{
        flex: 1,
        marginLeft: 'var(--sidebar-width)',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }} className="main-content-wrapper">
        {/* Mobile Header Bar */}
        <header className="glass" style={{
          height: 'var(--navbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 80
        }}>
          <div style={{ display: 'none' }} className="mobile-menu-trigger">
            <button onClick={() => setMobileMenuOpen(true)} style={{ color: 'var(--color-heading)' }}>
              <Menu size={24} />
            </button>
          </div>

          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
            {navItems.find((item) => item.path === location.pathname)?.name || 'Dashboard'}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
              ✦ Live Portal
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="container" style={{ padding: '2rem 1.5rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>

      {/* 3. Mobile Navigation Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 110, display: 'flex'
        }}>
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}
          ></div>

          {/* Drawer Content */}
          <div style={{
            position: 'relative',
            width: '280px',
            backgroundColor: 'var(--color-card)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-xl)',
            padding: '1.5rem'
          }} className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                <Shield size={20} /> DFI
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-heading)' }}>
                <X size={24} />
              </button>
            </div>

            {/* Nav List */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      color: isActive ? 'var(--color-primary)' : 'var(--color-body)',
                      backgroundColor: isActive ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                      fontWeight: isActive ? 600 : 500
                    }}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-error)',
                fontWeight: 600,
                marginTop: 'auto'
              }}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* CSS adjustments for sidebar responsive visibility */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none !important;
          }
          .main-content-wrapper {
            margin-left: 0 !important;
          }
          .mobile-menu-trigger {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
