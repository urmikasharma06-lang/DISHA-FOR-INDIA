import React from 'react';
import { Award, Download, CheckCircle2 } from 'lucide-react';

const Certificates = () => {
  return (
    <div style={{ padding: '1.5rem 0' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Your Earned Certificates</h2>
      <p style={{ color: 'var(--color-body)', marginBottom: '2rem' }}>
        Download secure, shareable, and verifiable PDF certificates for programs you've successfully completed.
      </p>

      <div className="grid grid-cols-2">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)' }}>
                <Award size={28} />
              </div>
              <span className="badge badge-green" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <CheckCircle2 size={12} /> Verifiable
              </span>
            </div>
            <h4 style={{ marginBottom: '0.5rem' }}>Youth Leadership Certificate</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', marginBottom: '1.5rem' }}>
              Awarded for active volunteering, mentoring new recruits, and conducting 20+ hours of digital literacy camps.
            </p>
          </div>
          <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
            <Download size={16} /> Download PDF
          </button>
        </div>

        <div className="card" style={{ opacity: 0.6, borderStyle: 'dashed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-border)', color: 'var(--color-body)' }}>
              <Award size={28} />
            </div>
          </div>
          <h4 style={{ marginBottom: '0.5rem' }}>Social Action Leader</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', marginBottom: '1.5rem' }}>
            Awarded upon completing 5 volunteering programs. Keep going to unlock!
          </p>
          <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
            Locked
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificates;
