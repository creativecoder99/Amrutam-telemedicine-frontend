'use client';

import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header
      style={{
        backgroundColor: 'var(--color-surface-raised)',
        borderBottom: '1px solid rgba(58, 100, 59, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 'var(--space-6)',
          paddingBottom: 'var(--space-6)',
        }}
      >
        {/* Brand Logo & Telehealth Monogram */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-surface-raised)',
            }}
          >
            {/* Ayurvedic Leaf Motif SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L12 22" />
              <path d="M12 7C16 7 20 10 20 15C20 19 16 21 12 22" />
              <path d="M12 7C8 7 4 10 4 15C4 19 8 21 12 22" />
            </svg>
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              AMRUTAM
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-border-muted)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Ayurvedic Telemedicine
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <Link
            href="/doctors"
            style={{
              fontSize: 'var(--font-size-md)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            Find Doctors
          </Link>
          <Link
            href="/patient"
            style={{
              fontSize: 'var(--font-size-md)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            My Consultations
          </Link>
          <Link
            href="/prescriptions/rx111111-1111-1111-1111-111111111111"
            style={{
              fontSize: 'var(--font-size-md)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            Prescriptions
          </Link>
          <Link
            href="/admin"
            style={{
              fontSize: 'var(--font-size-md)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            Governance & Audit
          </Link>
        </nav>

        {/* Primary Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/doctors"
            style={{
              backgroundColor: 'var(--color-text-primary)',
              color: 'var(--color-surface-raised)',
              padding: '8px 18px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-md)',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Book Consultation
          </Link>
        </div>
      </div>
    </header>
  );
};
