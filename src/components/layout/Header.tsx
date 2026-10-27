'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, openAuthModal, logoutUser } = useAuth();

  const getDashboardHref = () => {
    if (user?.role === 'ADMIN') return '/admin';
    if (user?.role === 'DOCTOR') return '/doctor';
    return '/patient';
  };

  const handleSignOut = () => {
    logoutUser();
    router.push('/');
  };

  const isLoggedIn = Boolean(user && user.email);

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
            {isLoggedIn ? (
              <>
                <span style={{ opacity: 0.9, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Signed in:</span>
                  <strong style={{ color: '#fff' }}>{user.fullName}</strong>
                  <span
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      fontSize: '9px',
                      fontWeight: 700,
                    }}
                  >
                    {user.role}
                  </span>
                </span>
                <Link
                  href={getDashboardHref()}
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    padding: '3px 9px',
                    borderRadius: '4px',
                  }}
                >
                  Dashboard →
                </Link>
                <button
                  id="top-signout-btn"
                  onClick={handleSignOut}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
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
          <img
            src="/images/logo/logo.jpeg"
            alt="Amrutam Logo"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              objectFit: 'cover',
              boxShadow: '0 2px 8px rgba(33, 61, 49, 0.2)',
              border: '1.5px solid rgba(58, 100, 59, 0.3)',
            }}
          />
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

        {/* Action Buttons: Sign In / Sign Up OR Dashboard + Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                href={getDashboardHref()}
                style={{
                  backgroundColor: '#3a643b',
                  color: '#ffffff',
                  border: '2px solid #213d31',
                  padding: '9px 18px',
                  borderRadius: '24px',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 3px 10px rgba(33, 61, 49, 0.2)',
                  transition: 'all 0.2s ease',
                }}
              >
                My Dashboard ({user.role}) →
              </Link>
              <button
                id="nav-signout-btn"
                onClick={handleSignOut}
                style={{
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  border: '1.5px solid #ef4444',
                  padding: '8px 16px',
                  borderRadius: '24px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </header>
  );
};
