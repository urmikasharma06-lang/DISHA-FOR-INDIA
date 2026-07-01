import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Users, Award, Calendar, ChevronRight, BookOpen, MessageSquare } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-container">
      {/* 1. Hero Section */}
      <section className="hero-section" style={{
        background: 'var(--gradient-primary)',
        color: '#ffffff',
        padding: '5rem 1.5rem',
        textAlign: 'center',
        borderRadius: '0 0 var(--radius-xl) var(--radius-xl)'
      }}>
        <div className="container animate-slide-up" style={{ maxWidth: '800px' }}>
          <span className="badge badge-green" style={{ marginBottom: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}>
            Empowering Youth, Transforming Communities
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '3rem', marginBottom: '1.5rem', fontWeight: 800 }}>
            Make a Real Impact with Disha for India
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: 0.9 }}>
            Join a modern community of passionate volunteers, develop new skills, track your contributions, and earn recognized credentials.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ backgroundColor: '#ffffff', color: 'var(--color-primary)', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)' }}>
              Start Volunteering <ChevronRight size={18} />
            </Link>
            <Link to="/programs" className="btn btn-secondary" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
              Explore Programs
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Impact Statistics */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div className="container">
          <div className="grid grid-cols-4">
            <div className="card text-center flex-center" style={{ flexDirection: 'column' }}>
              <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '2.25rem', color: 'var(--color-primary)', fontWeight: 800 }}>10K+</h3>
              <p style={{ color: 'var(--color-body)', fontSize: '0.9rem', fontWeight: 500 }}>Active Volunteers</p>
            </div>
            
            <div className="card text-center flex-center" style={{ flexDirection: 'column' }}>
              <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                <Calendar size={28} />
              </div>
              <h3 style={{ fontSize: '2.25rem', color: 'var(--color-secondary)', fontWeight: 800 }}>500+</h3>
              <p style={{ color: 'var(--color-body)', fontSize: '0.9rem', fontWeight: 500 }}>Programs Conducted</p>
            </div>

            <div className="card text-center flex-center" style={{ flexDirection: 'column' }}>
              <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)', marginBottom: '1rem' }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '2.25rem', color: 'var(--color-purple)', fontWeight: 800 }}>8K+</h3>
              <p style={{ color: 'var(--color-body)', fontSize: '0.9rem', fontWeight: 500 }}>Certificates Issued</p>
            </div>

            <div className="card text-center flex-center" style={{ flexDirection: 'column' }}>
              <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)', marginBottom: '1rem' }}>
                <TrendingUp size={28} />
              </div>
              <h3 style={{ fontSize: '2.25rem', color: 'var(--color-accent)', fontWeight: 800 }}>100K+</h3>
              <p style={{ color: 'var(--color-body)', fontSize: '0.9rem', fontWeight: 500 }}>Hours of Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Join Disha */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-xl)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Why Volunteer with DFI?</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-body)' }}>
              We've created a digital ecosystem that recognizes and rewards your social contributions.
            </p>
          </div>

          <div className="grid grid-cols-3">
            <div className="card">
              <div style={{ color: 'var(--color-primary)', marginBottom: '1.25rem' }}><Shield size={32} /></div>
              <h4 style={{ marginBottom: '0.75rem' }}>Verified Opportunities</h4>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-body)' }}>
                All programs are validated and coordinated by registered partners ensuring secure and high-impact environments.
              </p>
            </div>
            
            <div className="card">
              <div style={{ color: 'var(--color-secondary)', marginBottom: '1.25rem' }}><Award size={32} /></div>
              <h4 style={{ marginBottom: '0.75rem' }}>Verifiable Certificates</h4>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-body)' }}>
                Earn cryptographically secured certificates featuring unique QR codes to easily show on your LinkedIn or resume.
              </p>
            </div>

            <div className="card">
              <div style={{ color: 'var(--color-accent)', marginBottom: '1.25rem' }}><TrendingUp size={32} /></div>
              <h4 style={{ marginBottom: '0.75rem' }}>Gamified Progress</h4>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-body)' }}>
                Collect points, move up the leaderboard rankings, unlock new volunteer tiers, and gain access to premium benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Programs Banner */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ marginBottom: '0.5rem' }}>Active Volunteering Programs</h2>
              <p style={{ color: 'var(--color-body)' }}>Apply for programs that match your skills and location.</p>
            </div>
            <Link to="/programs" className="btn btn-secondary">View All Programs</Link>
          </div>

          <div className="grid grid-cols-3">
            {/* Sample Card 1 */}
            <div className="card glow-card">
              <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>Education</span>
              <h4 style={{ marginBottom: '0.75rem' }}>Digital Literacy Camp</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', marginBottom: '1.5rem' }}>
                Teach basic computing, internet navigation, and safety to kids in local public schools.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span>📍 New Delhi, DL</span>
                <Link to="/programs" className="btn btn-success" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Apply</Link>
              </div>
            </div>

            {/* Sample Card 2 */}
            <div className="card glow-card">
              <span className="badge badge-green" style={{ marginBottom: '1rem' }}>Environment</span>
              <h4 style={{ marginBottom: '0.75rem' }}>Urban Reforestation Drive</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', marginBottom: '1.5rem' }}>
                Help plant native saplings and clean local community parks to restore green cover.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span>📍 Mumbai, MH</span>
                <Link to="/programs" className="btn btn-success" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Apply</Link>
              </div>
            </div>

            {/* Sample Card 3 */}
            <div className="card glow-card">
              <span className="badge badge-orange" style={{ marginBottom: '1rem' }}>Health</span>
              <h4 style={{ marginBottom: '0.75rem' }}>Health & Hygiene Awareness</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', marginBottom: '1.5rem' }}>
                Conduct interactive workshops on health, sanitation, and clean water practices in urban slums.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span>📍 Bangalore, KA</span>
                <Link to="/programs" className="btn btn-success" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Apply</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section style={{
        background: 'var(--gradient-primary)',
        color: '#ffffff',
        padding: '5rem 1.5rem',
        textAlign: 'center',
        margin: '2rem 1.5rem',
        borderRadius: 'var(--radius-xl)'
      }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{ color: '#ffffff', marginBottom: '1rem' }}>Ready to Start Your Journey?</h2>
          <p style={{ marginBottom: '2.5rem', opacity: 0.9 }}>
            Join thousands of students and volunteers across the country. Register today and make your efforts count.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ backgroundColor: '#ffffff', color: 'var(--color-primary)' }}>
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
