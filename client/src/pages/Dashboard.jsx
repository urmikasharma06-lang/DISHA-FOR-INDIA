import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Award, Clock, Briefcase, Award as CertIcon, Sparkles, BookOpen, AlertCircle, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Handle fallback details for testing if the user details are empty
  const displayName = user?.name || 'Volunteer';
  const points = user?.points ?? 120;
  const hours = user?.hoursCompleted ?? 24;
  const programsCount = user?.programsJoined ?? 3;
  const certsCount = user?.certificatesEarned ?? 1;
  const level = user?.volunteerLevel || 'Beginner';
  const profileCompletion = user?.profileCompletion ?? 65;

  return (
    <div className="animate-fade-in" style={{ padding: '1rem 0' }}>
      {/* 1. Welcome Banner */}
      <div style={{
        background: 'var(--gradient-primary)',
        color: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '2.25rem',
        marginBottom: '2rem',
        boxShadow: 'var(--gradient-glow)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ color: '#ffffff', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>
            Hello, {displayName}! 👋
          </h2>
          <p style={{ opacity: 0.9, maxWidth: '600px', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
            Welcome to your dashboard. You are currently at the <strong style={{ color: '#FEFCE8' }}>{level}</strong> level. Keep up the amazing work!
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/programs" className="btn btn-primary" style={{ backgroundColor: '#ffffff', color: 'var(--color-primary)', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
              Explore Open Programs
            </Link>
          </div>
        </div>
        <div style={{
          position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.1, color: '#ffffff',
          transform: 'rotate(-15deg)'
        }}>
          <Sparkles size={240} />
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-body)', fontWeight: 600 }}>Total Points</span>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-heading)', margin: '0.1rem 0' }}>{points}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600 }}>★ Earned</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-secondary)' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-body)', fontWeight: 600 }}>Hours Served</span>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-heading)', margin: '0.1rem 0' }}>{hours}h</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-info)', fontWeight: 600 }}>✔ Completed</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-body)', fontWeight: 600 }}>Programs Joined</span>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-heading)', margin: '0.1rem 0' }}>{programsCount}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-body)', fontWeight: 600 }}>Active</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)' }}>
            <CertIcon size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-body)', fontWeight: 600 }}>Certificates</span>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-heading)', margin: '0.1rem 0' }}>{certsCount}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600 }}>Verified</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left column: Profile completion & Recent programs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Profile completion card */}
          {profileCompletion < 100 && (
            <div className="card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <AlertCircle style={{ color: 'var(--color-accent)' }} size={20} />
                  <h4 style={{ margin: 0 }}>Complete Your Profile</h4>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                  {profileCompletion}% Done
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', marginBottom: '1.25rem' }}>
                Fill in your skills, interests, and contact information to unlock program registrations and levels.
              </p>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <div style={{ width: `${profileCompletion}%`, height: '100%', backgroundColor: 'var(--color-accent)', borderRadius: '99px' }}></div>
              </div>
              <Link to="/profile/setup" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', alignSelf: 'flex-start' }}>
                Complete Setup
              </Link>
            </div>
          )}

          {/* Active registrations card */}
          <div className="card">
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.25rem' }}>Active Registrations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.975rem', marginBottom: '0.25rem' }}>Digital Literacy Camp</h4>
                  <span className="badge badge-orange">Pending Approval</span>
                </div>
                <Link to="/programs" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  Details <ArrowUpRight size={14} />
                </Link>
              </div>

              <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.975rem', marginBottom: '0.25rem' }}>Urban Reforestation Drive</h4>
                  <span className="badge badge-green">Approved & Joining</span>
                </div>
                <Link to="/programs" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  Details <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Level perks & leaderboards overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Volunteer level card */}
          <div className="card" style={{ background: '#FEFCE8', borderColor: '#FEF08A' }}>
            <h4 style={{ color: 'var(--color-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Award size={20} style={{ color: '#F59E0B' }} /> Level Perks
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#713F12', marginBottom: '1rem' }}>
              You are currently a <strong>{level}</strong> volunteer. Earn {200 - points} more points to reach <strong>Contributor</strong> level!
            </p>
            <div style={{ fontSize: '0.85rem', color: '#713F12', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span>✦</span> <span>Verified profile badge</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span>✦</span> <span>Access to offline local drives</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', opacity: 0.6 }}>
                <span>✦</span> <span>Earn custom certificate downloads (Requires Contributor)</span>
              </div>
            </div>
          </div>

          {/* Quick links card */}
          <div className="card">
            <h4 style={{ marginBottom: '1rem' }}>Quick Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Link to="/programs" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)', display: 'block', fontWeight: 500 }}>
                🔍 Browse All Programs
              </Link>
              <Link to="/leaderboard" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)', display: 'block', fontWeight: 500 }}>
                🏆 Leaderboard Standings
              </Link>
              <Link to="/certificates" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)', display: 'block', fontWeight: 500 }}>
                🎓 Download Certificates
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
