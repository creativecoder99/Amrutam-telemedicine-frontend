'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';

export const Header: React.FC = () => {
  const { user, currentPersonaKey, switchPersona } = useAuth();

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
      {/* Top Notification / Role Switcher Strip */}
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
              Simulated Role Session: <strong>{user.fullName}</strong> ({user.role}
              {user.verificationStatus ? ` • ${user.verificationStatus}` : ''})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="persona-switcher" style={{ opacity: 0.8, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Switch Persona:
            </label>
            <select
              id="persona-switcher"
              value={currentPersonaKey}
              onChange={(e) => switchPersona(e.target.value)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="patient" style={{ color: '#213d31', backgroundColor: '#fffdf3' }}>
                Patient: Arjun Verma (Vata-Pitta)
              </option>
              <option value="doctor_verified" style={{ color: '#213d31', backgroundColor: '#fffdf3' }}>
                Doctor (Verified): Dr. Rajesh Sharma (₹1,200 Wallet)
              </option>
              <option value="doctor_pending" style={{ color: '#213d31', backgroundColor: '#fffdf3' }}>
                Doctor (Pending KYC): Dr. Kavyanjali Sen
              </option>
              <option value="admin" style={{ color: '#213d31', backgroundColor: '#fffdf3' }}>
                Admin: Governance & Payouts Center
              </option>
            </select>

            <Link
              href="/doctor/register"
              style={{
                backgroundColor: 'var(--color-primary-accent)',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '11px',
              }}
            >
              + Register Doctor
            </Link>
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
          paddingTop: 'var(--space-5)',
          paddingBottom: 'var(--space-5)',
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

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Patient Dashboard
            {user.role === 'PATIENT' && (
              <span
                style={{
                  fontSize: '10px',
                  backgroundColor: 'rgba(58, 100, 59, 0.15)',
                  color: 'var(--color-primary-dark)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                }}
              >
                Active
              </span>
            )}
          </Link>

          <Link
            href="/doctor"
            style={{
              fontSize: 'var(--font-size-md)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: 'var(--radius-xs)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Doctor Dashboard
            {user.role === 'DOCTOR' && (
              <span
                style={{
                  fontSize: '10px',
                  backgroundColor: 'rgba(58, 100, 59, 0.15)',
                  color: 'var(--color-primary-dark)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                }}
              >
                Active
              </span>
            )}
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Admin Center
            {user.role === 'ADMIN' && (
              <span
                style={{
                  fontSize: '10px',
                  backgroundColor: 'rgba(58, 100, 59, 0.15)',
                  color: 'var(--color-primary-dark)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                }}
              >
                Active
              </span>
            )}
          </Link>
        </nav>

        {/* Primary Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            href="/doctors"
            style={{
              backgroundColor: 'var(--color-text-primary)',
              color: 'var(--color-surface-raised)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-md)',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </header>
  );
};
