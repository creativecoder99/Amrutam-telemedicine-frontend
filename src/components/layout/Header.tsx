'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';

export const Header: React.FC = () => {
  const { user, openAuthModal, logoutUser } = useAuth();

  const getDashboardHref = () => {
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'DOCTOR') return '/doctor';
    return '/patient';
  };

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
      {/* Top Clinical Trust & Session Strip */}
      <div
        style={{
          backgroundColor: 'var(--color-primary-dark)',
          color: 'var(--color-surface-raised)',
          padding: '6px 0',
          fontSize: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
              }}
            />
            <span style={{ opacity: 0.9 }}>
              🌿 100% Certified Ayurvedic Doctors • Digital Prescriptions • Zero Double-Booking Guarantee
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user && user.email ? (
              <>
                <span style={{ opacity: 0.85, fontSize: '11px' }}>
                  Signed in: <strong>{user.fullName}</strong> ({user.role})
                </span>
                <Link
                  href={getDashboardHref()}
                  style={{
                    color: '#fff',
                    textDecoration: 'underline',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  Open Dashboard →
                </Link>
                <button
                  onClick={logoutUser}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    border: 'none',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    fontSize: '10px',
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <span style={{ opacity: 0.85, fontSize: '11px' }}>
                ISO & NMC Compliant Telemedicine Platform
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 'var(--space-4)',
          paddingBottom: 'var(--space-4)',
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
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-surface-raised)',
            }}
          >
            {/* Ayurvedic Leaf Motif SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L12 22" />
              <path d="M12 7C16 7 20 10 20 15C20 19 16 21 12 22" />
              <path d="M12 7C8 7 4 10 4 15C4 19 8 21 12 22" />
            </svg>
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: '20px',
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
                fontSize: '10px',
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

        {/* Navigation Links (Clean, No Dashboard or Admin links) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <Link
            href="/doctors"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: 'var(--radius-xs)',
              transition: 'color 0.2s',
            }}
          >
            Find Doctors
          </Link>
          <Link
            href="/#specialties"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: 'var(--radius-xs)',
              transition: 'color 0.2s',
            }}
          >
            Specialties
          </Link>
          <Link
            href="/#how-it-works"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: 'var(--radius-xs)',
              transition: 'color 0.2s',
            }}
          >
            How It Works
          </Link>
        </nav>

        {/* Action Button: High Visibility Sign In / Sign Up Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            id="nav-signup-login-btn"
            onClick={() => openAuthModal('login')}
            style={{
              backgroundColor: '#3a643b',
              color: '#ffffff',
              border: '2px solid #213d31',
              padding: '10px 22px',
              borderRadius: '24px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(33, 61, 49, 0.25)',
              transition: 'all 0.2s ease',
              letterSpacing: '0.02em',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#213d31';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(33, 61, 49, 0.35)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#3a643b';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(33, 61, 49, 0.25)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Sign In / Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};
