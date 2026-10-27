import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-surface-strong)', // #344334 Deep Olive
        color: 'var(--color-surface-raised)',          // #fffdf3 Warm Cream
        paddingTop: 'var(--space-12)',
        paddingBottom: 'var(--space-10)',
        marginTop: 'auto',
        borderTop: '1px solid rgba(255, 253, 243, 0.1)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-10)',
            marginBottom: 'var(--space-11)',
          }}
        >
          {/* Brand & Healthcare Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <img
                src="/images/logo/logo.jpeg"
                alt="Amrutam Logo"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              />
              <h4 style={{ color: 'var(--color-surface-raised)', margin: 0, letterSpacing: '0.05em' }}>
                AMRUTAM TELEMEDICINE
              </h4>
            </div>
            <p style={{ color: 'rgba(255, 253, 243, 0.85)', fontSize: '14px', lineHeight: '22px' }}>
              Bridging centuries of authentic Ayurvedic wisdom with modern clinical telemedicine.
              Verified Vaidyas, zero double-booking distributed scheduling, and cryptographically
              signed digital prescriptions.
            </p>
          </div>

          {/* Clinical Specialties */}
          <div>
            <h4 style={{ color: 'var(--color-surface-raised)', marginBottom: '12px', fontSize: '16px' }}>
              Ayurvedic Specialties
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <li>
                <Link href="/doctors?specialty=Kayachikitsa" style={{ color: 'rgba(255, 253, 243, 0.85)' }}>
                  Kayachikitsa (Internal Medicine & Gut Health)
                </Link>
              </li>
              <li>
                <Link href="/doctors?specialty=Panchakarma" style={{ color: 'rgba(255, 253, 243, 0.85)' }}>
                  Panchakarma (Detoxification & Rejuvenation)
                </Link>
              </li>
              <li>
                <Link href="/doctors?specialty=Shalakya" style={{ color: 'rgba(255, 253, 243, 0.85)' }}>
                  Shalakya Tantra (ENT, Eye & Migraine Care)
                </Link>
              </li>
              <li>
                <Link href="/doctors?specialty=Prasuti" style={{ color: 'rgba(255, 253, 243, 0.85)' }}>
                  Prasuti & Stri Roga (Women Hormonal Balance)
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h4 style={{ color: 'var(--color-surface-raised)', marginBottom: '12px', fontSize: '16px' }}>
              Governance & Compliance
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <li>
                <Link href="/admin" style={{ color: 'rgba(255, 253, 243, 0.85)' }}>
                  Cryptographic Audit Trail Explorer
                </Link>
              </li>
              <li>
                <Link href="/terms" style={{ color: 'rgba(255, 253, 243, 0.85)' }}>
                  Telemedicine Practice Guidelines
                </Link>
              </li>
              <li>
                <Link href="/privacy" style={{ color: 'rgba(255, 253, 243, 0.85)' }}>
                  DISHA & ABDM Patient Health Privacy
                </Link>
              </li>
              <li style={{ color: 'rgba(255, 253, 243, 0.75)' }}>
                Field Encryption: AES-256-GCM Envelope
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Statutory Disclaimer */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 253, 243, 0.15)',
            paddingTop: 'var(--space-8)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '12px',
            color: 'rgba(255, 253, 243, 0.7)',
          }}
        >
          <div>
            © {new Date().getFullYear()} Amrutam Pharmaceuticals & Telehealth Pvt. Ltd. All rights reserved.
          </div>
          <div style={{ maxWidth: '600px', textAlign: 'right' }}>
            Disclaimer: Telemedicine consultations are intended for non-emergency clinical evaluation. In life-threatening emergencies, please visit the nearest hospital emergency department immediately.
          </div>
        </div>
      </div>
    </footer>
  );
};
