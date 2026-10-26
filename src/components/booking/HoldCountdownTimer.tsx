'use client';

import React, { useState, useEffect } from 'react';

export interface HoldCountdownTimerProps {
  expiresAt: string;
  onExpire?: () => void;
}

export const HoldCountdownTimer: React.FC<HoldCountdownTimerProps> = ({ expiresAt, onExpire }) => {
  const calculateSecondsLeft = () => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  };

  const [secondsLeft, setSecondsLeft] = useState(calculateSecondsLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateSecondsLeft();
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isExpiringSoon = secondsLeft > 0 && secondsLeft < 120; // under 2 mins
  const isExpired = secondsLeft === 0;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 16px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: isExpired
          ? 'var(--color-status-error-bg)'
          : isExpiringSoon
          ? 'var(--color-status-warning-bg)'
          : 'var(--color-status-success-bg)',
        border: `1.5px solid ${
          isExpired
            ? 'var(--color-status-error)'
            : isExpiringSoon
            ? 'var(--color-status-warning)'
            : 'var(--color-status-success)'
        }`,
        color: isExpired
          ? 'var(--color-status-error)'
          : isExpiringSoon
          ? 'var(--color-status-warning)'
          : 'var(--color-status-success)',
        fontSize: '14px',
        fontWeight: 600,
      }}
    >
      <span style={{ fontSize: '16px' }}>⏱</span>
      {isExpired ? (
        <span>Hold expired. Please re-select a slot to proceed.</span>
      ) : (
        <span>
          Slot Reserved for Checkout: <strong>{formattedTime}</strong>
        </span>
      )}
    </div>
  );
};
