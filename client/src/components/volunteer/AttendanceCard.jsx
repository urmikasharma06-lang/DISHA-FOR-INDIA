import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import StatusBadge from './StatusBadge';

const AttendanceCard = ({ record }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1.25rem',
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        gap: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'var(--transition-fast)'
      }}
    >
      {/* Date block */}
      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)',
        minWidth: '70px', flexShrink: 0
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-body)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
          {new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-heading)', lineHeight: 1.1 }}>
          {new Date(record.date).getDate()}
        </span>
      </div>

      {/* Main Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--color-heading)' }}>{record.programTitle}</h4>
          <StatusBadge status={record.status} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {record.checkInTime && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--color-body)' }}>
              <Clock size={14} />
              <span>{record.checkInTime} {record.checkOutTime ? `- ${record.checkOutTime}` : '(Active)'}</span>
            </div>
          )}
          
          {record.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--color-body)' }}>
              <MapPin size={14} />
              <span>{record.location}</span>
            </div>
          )}
          
          {record.coordinatorName && (
            <div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>
              Coord: <span style={{ fontWeight: 500, color: 'var(--color-heading)' }}>{record.coordinatorName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hours Badge */}
      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', flexShrink: 0
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-body)', fontWeight: 600, marginBottom: '0.25rem' }}>Hours</span>
        <div style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: 'rgba(37, 99, 235, 0.1)', 
          color: 'var(--color-primary)', 
          borderRadius: '99px',
          fontWeight: 700,
          fontSize: '1.1rem'
        }}>
          {record.hoursWorked || '0'}
        </div>
      </div>
    </motion.div>
  );
};

export default AttendanceCard;
