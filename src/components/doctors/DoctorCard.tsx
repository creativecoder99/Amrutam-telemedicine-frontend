import React from 'react';
import Link from 'next/link';
import { Doctor } from '../../types';
import { Badge } from '../ui/Badge';

export interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <article
      className="amrutam-card"
      style={{
        padding: 'var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <div>
        {/* Header: Verified Status & Rating */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <Badge variant="success">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            NMC Verified Vaidya
          </Badge>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 700, color: '#855309' }}>
            <span>★</span>
            <span>{doctor.rating.toFixed(2)}</span>
            <span style={{ color: '#666', fontWeight: 400, fontSize: '12px' }}>({doctor.reviewCount})</span>
          </div>
        </div>

        {/* Doctor Name & Qualifications */}
        <h3 style={{ fontSize: '19px', marginBottom: '4px', color: 'var(--color-text-primary)' }}>
          {doctor.fullName}
        </h3>
        <p style={{ fontSize: '13.5px', color: 'var(--color-border-muted)', fontWeight: 600, marginBottom: '8px' }}>
          {doctor.qualification}
        </p>

        {/* Primary Specialty & Experience */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          <Badge variant="neutral">{doctor.primarySpecialty}</Badge>
          <Badge variant="info">{doctor.experienceYears} Years Clinical Exp.</Badge>
        </div>

        {/* Bio Summary */}
        <p style={{ fontSize: '14px', lineHeight: '21px', color: '#334433', marginBottom: '16px' }}>
          {doctor.bio.length > 130 ? `${doctor.bio.substring(0, 130)}...` : doctor.bio}
        </p>
      </div>

      {/* Footer: Fee & Booking CTA */}
      <div
        style={{
          borderTop: '1px solid rgba(58, 100, 59, 0.15)',
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', color: '#666', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Consultation Fee
          </span>
          <span style={{ fontSize: '19px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            ₹{doctor.consultationFee}
          </span>
        </div>

        <Link
          href={`/doctors/${doctor.id}`}
          style={{
            backgroundColor: 'var(--color-text-primary)',
            color: 'var(--color-surface-raised)',
            padding: '8px 18px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color var(--motion-duration-fast)',
          }}
        >
          View Available Slots →
        </Link>
      </div>
    </article>
  );
};
