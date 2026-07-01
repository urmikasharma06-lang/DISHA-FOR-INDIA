import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, Send, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#0F172A',
      color: '#ffffff',
      padding: '5rem 1.5rem 2.5rem 1.5rem',
      borderTop: '1px solid #1E293B',
      transition: 'var(--transition-normal)'
    }}>
      <div className="container">
        {/* Main Columns Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
          gap: '3rem',
          marginBottom: '4rem'
        }} className="footer-grid">
          
          {/* Column 1: Info & Tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: '#ffffff' }}>
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
            <p style={{ color: 'rgba(248, 250, 252, 0.7)', fontSize: '0.925rem', maxWidth: '300px' }}>
              A modern digital volunteer network bridging the gap between student talent and impactful grassroots social campaigns.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <a href="#" style={{ color: 'rgba(248, 250, 252, 0.6)', padding: '0.5rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-flex' }}>
                <Twitter size={16} />
              </a>
              <a href="#" style={{ color: 'rgba(248, 250, 252, 0.6)', padding: '0.5rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-flex' }}>
                <Linkedin size={16} />
              </a>
              <a href="#" style={{ color: 'rgba(248, 250, 252, 0.6)', padding: '0.5rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-flex' }}>
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Link to="/" style={{ color: 'rgba(248, 250, 252, 0.7)' }}>Landing Home</Link>
              <Link to="/programs" style={{ color: 'rgba(248, 250, 252, 0.7)' }}>Browse Programs</Link>
              <Link to="/leaderboard" style={{ color: 'rgba(248, 250, 252, 0.7)' }}>Leaderboard</Link>
            </div>
          </div>

          {/* Column 3: Contact info */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>Contact Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(248, 250, 252, 0.7)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <MapPin size={16} style={{ color: 'var(--color-primary)' }} />
                <span>New Delhi, India</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Mail size={16} style={{ color: 'var(--color-secondary)' }} />
                <span>support@dishaforindia.org</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Phone size={16} style={{ color: 'var(--color-accent)' }} />
                <span>+91 11 2345 6789</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>Join the Movement</h4>
            <p style={{ color: 'rgba(248, 250, 252, 0.7)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Get weekly updates about new campaigns and events directly in your inbox.
            </p>
            <form style={{ display: 'flex', gap: '0.25rem', position: 'relative' }} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                required
                style={{
                  flex: 1,
                  padding: '0.6rem 2.5rem 0.6rem 0.75rem',
                  fontSize: '0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '0.4rem',
                  color: 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright section */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.825rem',
          color: 'rgba(248, 250, 252, 0.4)'
        }} className="footer-bottom">
          <span>© {new Date().getFullYear()} Disha for India. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Made with <Heart size={12} style={{ color: 'var(--color-error)' }} /> for social impact
          </span>
        </div>
      </div>

      {/* Inline styles for footer responsiveness */}
      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-bottom {
            justify-content: center !important;
            flex-direction: column !important;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
