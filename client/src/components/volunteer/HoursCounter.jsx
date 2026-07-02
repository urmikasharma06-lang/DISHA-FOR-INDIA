import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const HoursCounter = ({ value = 0, suffix = '', label, size = 'lg' }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 1.5,
      ease: "easeOut"
    });

    return animation.stop;
  }, [value, count]);

  const fontSize = size === 'lg' ? '3rem' : '1.75rem';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && <span style={{ fontSize: '0.85rem', color: 'var(--color-body)', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</span>}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
        <motion.span 
          className="hours-gradient-text"
          style={{ fontSize, lineHeight: 1 }}
        >
          {rounded}
        </motion.span>
        {suffix && (
          <span style={{ fontSize: size === 'lg' ? '1.25rem' : '0.9rem', color: 'var(--color-body)', fontWeight: 600 }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

export default HoursCounter;
