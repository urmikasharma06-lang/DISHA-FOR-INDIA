import React from 'react';
import { Calendar, MapPin, Tag } from 'lucide-react';

const Programs = () => {
  return (
    <div style={{ padding: '1.5rem 0' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Browse Opportunities</h2>
      <p style={{ color: 'var(--color-body)', marginBottom: '2rem' }}>
        Discover social campaigns, teaching initiatives, and ecological programs you can join.
      </p>
      
      <div className="grid grid-cols-3">
        <div className="card">
          <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>Education</span>
          <h4>Digital Literacy Camp</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', margin: '1rem 0' }}>
            Teach basic computing and safety to kids in municipal schools.
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-body)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> New Delhi, DL</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> Starts: July 15, 2026</span>
          </div>
          <button className="btn btn-success" style={{ width: '100%' }}>Apply Now</button>
        </div>

        <div className="card">
          <span className="badge badge-green" style={{ marginBottom: '1rem' }}>Environment</span>
          <h4>Urban Reforestation Drive</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', margin: '1rem 0' }}>
            Help plant native saplings and clean local community parks to restore green cover.
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-body)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> Mumbai, MH</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> Starts: July 18, 2026</span>
          </div>
          <button className="btn btn-success" style={{ width: '100%' }}>Apply Now</button>
        </div>

        <div className="card">
          <span className="badge badge-orange" style={{ marginBottom: '1rem' }}>Health</span>
          <h4>Hygiene Awareness Workshop</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', margin: '1rem 0' }}>
            Deliver education sessions regarding hand washing and clean water practices.
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-body)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> Bangalore, KA</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> Starts: July 22, 2026</span>
          </div>
          <button className="btn btn-success" style={{ width: '100%' }}>Apply Now</button>
        </div>
      </div>
    </div>
  );
};

export default Programs;
