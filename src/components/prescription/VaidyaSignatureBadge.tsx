import React from 'react';

export interface VaidyaSignatureBadgeProps {
  signature: string;
  signedAt: string;
  doctorName?: string;
  licenseNumber?: string;
  isValid?: boolean;
}

export const VaidyaSignatureBadge: React.FC<VaidyaSignatureBadgeProps> = ({
  signature,
  signedAt,
  doctorName = 'Verified Ayurvedic Vaidya',
  licenseNumber = 'AY-NMC-VERIFIED',
  isValid = true,
}) => {
  return (
    <div
      style={{
        padding: 'var(--space-8)',
        backgroundColor: 'var(--color-surface-muted)',
        border: '1.5px solid var(--color-border-muted)',
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '480px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>📜</span>
          <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text-primary)' }}>
            Digitally Signed Medical Record
          </span>
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: isValid ? 'var(--color-status-success-bg)' : 'var(--color-status-error-bg)',
            color: isValid ? 'var(--color-status-success)' : 'var(--color-status-error)',
            border: `1px solid ${isValid ? 'var(--color-status-success)' : 'var(--color-status-error)'}`,
          }}
        >
          {isValid ? '✓ HMAC-SHA256 Verified' : '✗ Signature Invalid'}
        </span>
      </div>

      <div style={{ fontSize: '13px', color: '#334433', lineHeight: '20px' }}>
        <div>
          Signatory: <strong>{doctorName}</strong>
        </div>
        <div>
          Medical License: <strong>{licenseNumber}</strong>
        </div>
        <div>
          Timestamp: <strong>{new Date(signedAt).toLocaleString()}</strong>
        </div>
      </div>

      <div
        style={{
          marginTop: '4px',
          padding: '6px 8px',
          backgroundColor: 'rgba(33, 61, 49, 0.06)',
          borderRadius: '4px',
          fontSize: '11px',
          fontFamily: 'monospace',
          color: 'var(--color-text-primary)',
          wordBreak: 'break-all',
        }}
      >
        HMAC: {signature}
      </div>
    </div>
  );
};
