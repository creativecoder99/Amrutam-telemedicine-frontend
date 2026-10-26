import React from 'react';
import { PrescriptionItem } from '../../types';

export interface PrescriptionTableProps {
  items: PrescriptionItem[];
}

export const PrescriptionTable: React.FC<PrescriptionTableProps> = ({ items }) => {
  return (
    <div style={{ overflowX: 'auto', width: '100%', margin: 'var(--space-8) 0' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '14px',
          backgroundColor: 'var(--color-surface-raised)',
          border: '1px solid rgba(58, 100, 59, 0.2)',
          borderRadius: 'var(--radius-xs)',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '1.5px solid var(--color-border-muted)' }}>
            <th style={{ padding: '12px 14px', color: 'var(--color-text-primary)', fontWeight: 700 }}>#</th>
            <th style={{ padding: '12px 14px', color: 'var(--color-text-primary)', fontWeight: 700 }}>Ayurvedic Formulation</th>
            <th style={{ padding: '12px 14px', color: 'var(--color-text-primary)', fontWeight: 700 }}>Dosage</th>
            <th style={{ padding: '12px 14px', color: 'var(--color-text-primary)', fontWeight: 700 }}>Frequency</th>
            <th style={{ padding: '12px 14px', color: 'var(--color-text-primary)', fontWeight: 700 }}>Anupana (Carrier)</th>
            <th style={{ padding: '12px 14px', color: 'var(--color-text-primary)', fontWeight: 700 }}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr
              key={item.id || idx}
              style={{
                borderBottom: '1px solid rgba(58, 100, 59, 0.12)',
              }}
            >
              <td style={{ padding: '12px 14px', fontWeight: 600 }}>{idx + 1}</td>
              <td style={{ padding: '12px 14px' }}>
                <strong style={{ display: 'block', color: 'var(--color-text-primary)' }}>
                  {item.medicineName}
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--color-border-muted)' }}>
                  {item.formulation}
                </span>
                {item.specialInstructions && (
                  <span style={{ display: 'block', fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    Note: {item.specialInstructions}
                  </span>
                )}
              </td>
              <td style={{ padding: '12px 14px' }}>{item.dosage}</td>
              <td style={{ padding: '12px 14px' }}>{item.frequency}</td>
              <td style={{ padding: '12px 14px' }}>
                <span style={{ color: 'var(--color-border-muted)', fontWeight: 600 }}>
                  {item.anupana}
                </span>
              </td>
              <td style={{ padding: '12px 14px', fontWeight: 600 }}>{item.durationDays} Days</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
