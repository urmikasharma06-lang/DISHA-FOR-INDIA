import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '', // added for backend compatibility
    role: 'volunteer', // Default to volunteer
  });
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    try {
      await register(formData);
      // After registration, redirect to login page with a success message
      navigate('/login?registered=true');
    } catch (err) {
      setLocalError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '4rem auto', padding: '1rem' }} className="animate-slide-up">
      <div className="card" style={{ boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--color-body)', fontSize: '0.9rem' }}>Join the Disha for India volunteer team</p>
        </div>

        {localError && (
          <div style={{
            display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)',
            borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 500
          }}>
            <AlertCircle size={16} />
            <span>{localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }}>
                <User size={18} />
              </span>
              <input
                id="name"
                type="text"
                className="form-control"
                placeholder="John Doe"
                style={{ paddingLeft: '40px' }}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }}>
                <UserCheck size={18} />
              </span>
              <input
                id="username"
                type="text"
                className="form-control"
                placeholder="johndoe12"
                style={{ paddingLeft: '40px' }}
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }}>
                <Mail size={18} />
              </span>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="john@example.com"
                style={{ paddingLeft: '40px' }}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password (min 8 characters)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }}>
                <Lock size={18} />
              </span>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                style={{ paddingLeft: '40px' }}
                value={formData.password}
                onChange={handleChange}
                min={8}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem', gap: '0.75rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'} <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-body)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
