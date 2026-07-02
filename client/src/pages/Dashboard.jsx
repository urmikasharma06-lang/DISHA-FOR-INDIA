import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Clock, Briefcase, Award as CertIcon, Sparkles, AlertCircle, ArrowUpRight, PlayCircle, ShieldCheck } from 'lucide-react';
import { useVolunteer } from '../context/VolunteerContext';
import SkeletonLoader from '../components/volunteer/SkeletonLoader';
import CheckInButton from '../components/volunteer/CheckInButton';
import StatusBadge from '../components/volunteer/StatusBadge';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { 
    volunteerHours, 
    fetchVolunteerHours,
    applications,
    fetchApplications,
    joinedPrograms,
    fetchJoinedPrograms,
    checkInStatus,
    fetchAttendanceDashboard,
    attendanceDashboard,
    applicationsLoading
  } = useVolunteer();

  useEffect(() => {
    fetchVolunteerHours();
    fetchApplications();
    fetchJoinedPrograms();
    fetchAttendanceDashboard();
  }, [fetchVolunteerHours, fetchApplications, fetchJoinedPrograms, fetchAttendanceDashboard]);

  // Handle fallback details for testing if the user details are empty
  const displayName = user?.name || 'Volunteer';
  const points = user?.points ?? 120;
  const level = user?.volunteerLevel || 'Beginner';
  const profileCompletion = user?.profileCompletion ?? 65;

  const hours = volunteerHours?.lifetime || user?.hoursCompleted || 0;
  const activePrograms = joinedPrograms.filter(p => p.status === 'active');
  const programsCount = joinedPrograms.length || user?.programsJoined || 0;
  const certsCount = user?.certificatesEarned || 0;

  const pendingApps = applications.filter(a => a.status === 'pending' || a.status === 'under_review');

  return (
    <div className="animate-fade-in page-container" style={{ padding: '2rem' }}>
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
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/programs" className="btn btn-primary" style={{ backgroundColor: '#ffffff', color: 'var(--color-primary)', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
              Explore Open Programs
            </Link>
            
            {activePrograms.length > 0 && !checkInStatus.checkedIn && (
              <button 
                onClick={() => navigate('/attendance/check-in')} 
                className="btn btn-success" 
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                <PlayCircle size={16} /> Quick Check-In
              </button>
            )}
            {checkInStatus.checkedIn && (
              <button 
                onClick={() => navigate('/attendance/checkout')} 
                className="btn btn-accent" 
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                End Session Now
              </button>
            )}
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
        <div className="card glow-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-body)', fontWeight: 600 }}>Total Points</span>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-heading)', margin: '0.1rem 0' }}>{points}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600 }}>★ Earned</span>
          </div>
        </div>

        <div className="card glow-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer' }} onClick={() => navigate('/attendance/hours')}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-body)', fontWeight: 600 }}>Hours Served</span>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-heading)', margin: '0.1rem 0' }}>{hours}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-body)', fontWeight: 600 }}>Lifetime</span>
          </div>
        </div>

        <div className="card glow-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer' }} onClick={() => navigate('/my-programs')}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-body)', fontWeight: 600 }}>My Programs</span>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-heading)', margin: '0.1rem 0' }}>{programsCount}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-body)', fontWeight: 600 }}>{activePrograms.length} Active</span>
          </div>
        </div>

        <div className="card glow-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer' }} onClick={() => navigate('/certificates')}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)' }}>
            <CertIcon size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-body)', fontWeight: 600 }}>Certificates</span>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-heading)', margin: '0.1rem 0' }}>{certsCount}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-body)', fontWeight: 600 }}>Verified</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left column: Main activities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Active registrations card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Current Activity</h3>
              <Link to="/applications" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                View All
              </Link>
            </div>
            
            {applicationsLoading ? (
              <SkeletonLoader type="list" count={2} />
            ) : pendingApps.length > 0 || activePrograms.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Active Programs first */}
                {activePrograms.slice(0, 2).map(prog => (
                  <div key={prog.id} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.975rem', marginBottom: '0.25rem' }}>{prog.programTitle}</h4>
                      <StatusBadge status={prog.status} />
                    </div>
                    <Link to="/attendance" className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                      Mark Attendance
                    </Link>
                  </div>
                ))}

                {/* Pending Applications */}
                {pendingApps.slice(0, 2).map(app => (
                  <div key={app.id} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '0.975rem', marginBottom: '0.25rem' }}>{app.programTitle}</h4>
                      <StatusBadge status={app.status} />
                    </div>
                    <Link to={`/applications/${app.id}`} style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      Details <ArrowUpRight size={14} />
                    </Link>
                  </div>
                ))}

              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-body)' }}>
                You have no active programs or pending applications. <Link to="/programs" style={{ color: 'var(--color-primary)' }}>Find a program</Link>
              </div>
            )}
          </div>

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

        </div>

        {/* Right column: Level perks & leaderboards overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Volunteer level card */}
          <div className="card" style={{ background: '#FEFCE8', borderColor: '#FEF08A' }}>
            <h4 style={{ color: 'var(--color-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Award size={20} style={{ color: '#F59E0B' }} /> Level Perks
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#713F12', marginBottom: '1rem' }}>
              You are currently a <strong>{level}</strong> volunteer. Earn {200 - points > 0 ? 200 - points : 50} more points to reach next level!
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
              <Link to="/applications" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)', display: 'block', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} className="text-primary" /> Track Applications
              </Link>
              <Link to="/attendance" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)', display: 'block', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} className="text-primary" /> Log Attendance
              </Link>
              <Link to="/leaderboard" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)', display: 'block', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={16} className="text-primary" /> Leaderboard Standings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
