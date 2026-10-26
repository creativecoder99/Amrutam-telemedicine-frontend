import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id,
  style,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        style={{
          padding: '10px 14px',
          backgroundColor: 'var(--color-surface-raised)',
          color: 'var(--color-text-primary)',
          border: error ? '1.5px solid var(--color-status-error)' : '1px solid rgba(58, 100, 59, 0.35)',
          borderRadius: 'var(--radius-xs)',
          fontSize: 'var(--font-size-md)',
          outline: 'none',
          transition: 'border-color var(--motion-duration-fast)',
          ...style,
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-status-error)', fontWeight: 500 }}>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span style={{ fontSize: 'var(--font-size-xs)', color: '#556b2f' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
