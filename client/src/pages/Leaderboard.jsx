import React from 'react';
import { Award, Medal, ShieldAlert } from 'lucide-react';

const Leaderboard = () => {
  const topVolunteers = [
    { rank: 1, name: 'Ananya Iyer', points: 1420, level: 'Legend', color: '#FBBF24', badge: '🥇' },
    { rank: 2, name: 'Rohan Sharma', points: 1210, level: 'Diamond', color: '#CBD5E1', badge: '🥈' },
    { rank: 3, name: 'Kabir Mehta', points: 1100, level: 'Platinum', color: '#B45309', badge: '🥉' },
    { rank: 4, name: 'Priya Nair', points: 950, level: 'Gold', color: 'transparent', badge: '4' },
    { rank: 5, name: 'Aarav Gupta', points: 880, level: 'Silver', color: 'transparent', badge: '5' },
  ];

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <div style={{
        background: '#FEFCE8',
        border: '1px solid #FEF08A',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ color: '#FBBF24', fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
        <h2 style={{ color: '#713F12', marginBottom: '0.5rem' }}>Volunteer Leaderboard</h2>
        <p style={{ color: '#713F12', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
          Celebrate our community leaders who are dedicating their time and effort to bring social impact across India.
        </p>
      </div>

      <div className="card">
        <h4 style={{ marginBottom: '1.25rem' }}>Top Contributors</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {topVolunteers.map((vol) => (
            <div
              key={vol.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: vol.rank <= 3 ? 'rgba(254, 252, 232, 0.5)' : 'var(--color-card)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: vol.color !== 'transparent' ? vol.color : 'var(--color-border)',
                    color: vol.rank <= 3 ? '#ffffff' : 'var(--color-body)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  {vol.badge}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', margin: 0 }}>{vol.name}</h4>
                  <span className="badge badge-blue" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>{vol.level}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>{vol.points}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-body)' }}>points</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
