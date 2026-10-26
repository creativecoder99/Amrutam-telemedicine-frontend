'use client';

import React from 'react';
import { Input } from '../ui/Input';

export interface FilterBarProps {
  specialty: string;
  onSpecialtyChange: (specialty: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  maxFee: number;
  onMaxFeeChange: (fee: number) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  specialty,
  onSpecialtyChange,
  searchQuery,
  onSearchChange,
  maxFee,
  onMaxFeeChange,
}) => {
  const specialties = [
    'All Specialties',
    'Kayachikitsa (Internal Medicine)',
    'Panchakarma (Detoxification)',
    'Shalakya Tantra (ENT & Eye Care)',
    'Prasuti & Stri Roga (Women Health)',
  ];

  return (
    <div
      className="amrutam-card"
      style={{
        padding: 'var(--space-8)',
        marginBottom: 'var(--space-10)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-6)',
        alignItems: 'flex-end',
      }}
    >
      {/* Text Search */}
      <div style={{ flex: '2 1 250px' }}>
        <Input
          label="Search by Doctor Name, Condition or Symptom"
          placeholder="e.g. Acidity, Migraine, Dr. Rajesh Sharma"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Specialty Filter */}
      <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label
          htmlFor="specialty-select"
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          Clinical Specialty
        </label>
        <select
          id="specialty-select"
          value={specialty}
          onChange={(e) => onSpecialtyChange(e.target.value === 'All Specialties' ? '' : e.target.value)}
          style={{
            padding: '10px 14px',
            backgroundColor: 'var(--color-surface-raised)',
            color: 'var(--color-text-primary)',
            border: '1px solid rgba(58, 100, 59, 0.35)',
            borderRadius: 'var(--radius-xs)',
            fontSize: 'var(--font-size-md)',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {specialties.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Max Fee Slider */}
      <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
          <span>Max Fee</span>
          <span>₹{maxFee}</span>
        </div>
        <input
          type="range"
          min="400"
          max="1200"
          step="50"
          value={maxFee}
          onChange={(e) => onMaxFeeChange(Number(e.target.value))}
          style={{
            accentColor: 'var(--color-border-muted)',
            cursor: 'pointer',
            height: '6px',
          }}
        />
      </div>
    </div>
  );
};
