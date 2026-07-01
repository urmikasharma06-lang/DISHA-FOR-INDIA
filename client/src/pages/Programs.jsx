import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ProgramCard } from '../components/ProgramCard';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await api.get('/programs'); // backend returns array of program objects
        setPrograms(data);
      } catch (err) {
        console.error('Failed to fetch programs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="loader" style={{ width: '48px', height: '48px', border: '4px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Browse Opportunities</h2>
      <p style={{ color: 'var(--color-body)', marginBottom: '2rem' }}>
        Discover social campaigns, teaching initiatives, and ecological programs you can join.
      </p>
      <div className="grid grid-cols-3">
        {programs.map((program) => (
          <ProgramCard key={program._id} program={program} />
        ))}
      </div>
    </div>
  );
};

export default Programs;



