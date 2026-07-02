import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, trend, color = 'primary', suffix = '' }) => {
  const getColorValue = () => {
    switch (color) {
      case 'primary': return 'rgba(37, 99, 235, 0.1)';
      case 'secondary': return 'rgba(16, 185, 129, 0.1)';
      case 'accent': return 'rgba(245, 158, 11, 0.1)';
      case 'purple': return 'rgba(139, 92, 246, 0.1)';
      case 'error': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(37, 99, 235, 0.1)';
    }
  };

  const getTextColorValue = () => {
    switch (color) {
      case 'primary': return 'var(--color-primary)';
      case 'secondary': return 'var(--color-secondary)';
      case 'accent': return 'var(--color-accent)';
      case 'purple': return 'var(--color-purple)';
      case 'error': return 'var(--color-error)';
      default: return 'var(--color-primary)';
    }
  };

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: getColorValue(), color: getTextColorValue() }}>
        {Icon}
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-body)', fontWeight: 600 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '1.75rem', color: 'var(--color-heading)', margin: '0.1rem 0' }}
          >
            {value}{suffix}
          </motion.h3>
          
          {trend && (
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              fontSize: '0.75rem', 
              fontWeight: 600,
              color: trend.direction === 'up' ? 'var(--color-success)' : 'var(--color-error)'
            }}>
              {trend.direction === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
