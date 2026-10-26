'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'subtle' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-text-primary)', // #213d31 Deep Forest Green
          color: 'var(--color-surface-raised)',        // #fffdf3 Warm Cream
          border: '1px solid var(--color-text-primary)',
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-border-muted)',          // #3a643b Moss Green
          border: '1.5px solid var(--color-border-muted)',
        };
      case 'subtle':
        return {
          backgroundColor: 'var(--color-surface-muted)', // #f7fbf5
          color: 'var(--color-text-primary)',
          border: '1px solid rgba(58, 100, 59, 0.2)',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-status-error)',
          color: '#ffffff',
          border: '1px solid var(--color-status-error)',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '6px 14px',
          fontSize: 'var(--font-size-sm)',
          borderRadius: 'var(--radius-xs)',
        };
      case 'lg':
        return {
          padding: '12px 28px',
          fontSize: 'var(--font-size-2xl)',
          borderRadius: 'var(--radius-md)',
        };
      case 'md':
      default:
        return {
          padding: '10px 20px',
          fontSize: 'var(--font-size-md)',
          borderRadius: 'var(--radius-sm)',
        };
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'all var(--motion-duration-fast) var(--motion-ease)',
        outline: 'none',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      className={`amrutam-btn ${className}`}
      {...props}
    >
      {isLoading ? (
        <span
          style={{
            display: 'inline-block',
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : null}
      {children}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: var(--shadow-subtle);
          filter: brightness(1.08);
        }
        button:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
    </button>
  );
};
