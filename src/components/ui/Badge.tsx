import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'danger' | 'info' | 'neutral';
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', style }) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return {
          bg: 'var(--color-status-success-bg)',
          color: 'var(--color-status-success)',
          border: '1px solid rgba(46, 109, 56, 0.3)',
        };
      case 'warning':
        return {
          bg: 'var(--color-status-warning-bg)',
          color: 'var(--color-status-warning)',
          border: '1px solid rgba(133, 83, 9, 0.3)',
        };
      case 'error':
      case 'danger':
        return {
          bg: 'var(--color-status-error-bg)',
          color: 'var(--color-status-error)',
          border: '1px solid rgba(139, 30, 30, 0.3)',
        };
      case 'info':
        return {
          bg: 'var(--color-status-info-bg)',
          color: 'var(--color-status-info)',
          border: '1px solid rgba(27, 75, 102, 0.3)',
        };
      case 'neutral':
      default:
        return {
          bg: 'var(--color-surface-muted)',
          color: 'var(--color-text-primary)',
          border: '1px solid rgba(58, 100, 59, 0.25)',
        };
    }
  };

  const { bg, color, border } = getColors();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 600,
        backgroundColor: bg,
        color,
        border,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
};
