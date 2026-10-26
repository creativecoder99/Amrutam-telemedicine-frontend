import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-surface-raised)', minHeight: '100vh', padding: 'var(--space-12) 0' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <Link href="/" style={{ color: 'var(--color-border-muted)', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>
          ← Back to Amrutam Home
        </Link>

        <h1 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--color-text-primary)' }}>
          Healthcare Privacy Policy & PHI Protection
        </h1>

        <p style={{ color: '#555', fontSize: '14px', marginBottom: '28px' }}>
          Compliance: DISHA (Digital Information Security in Healthcare Act) & ABDM Standards
        </p>

        <div className="amrutam-card" style={{ padding: 'var(--space-10)', display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: '26px', fontSize: '15px' }}>
          <section>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>1. Protected Health Information (PHI)</h2>
            <p>
              We treat all patient clinical data—including Prakriti assessments, pulse diagnosis observations (Nadi Pariksha),
              symptoms, diagnoses, and SOAP consultation notes—with the highest level of security.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>2. Field-Level Envelope Encryption (AES-256-GCM)</h2>
            <p>
              All confidential medical notes are encrypted at rest using AES-256 in Galois/Counter Mode (GCM).
              Database administrators and unauthorized services cannot view decrypted clinical text.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>3. Cryptographically Chained Audit Trail</h2>
            <p>
              In accordance with healthcare regulatory standards, every access, modification, or export of patient
              health records generates an immutable audit record linked to the previous transaction hash via HMAC-SHA256,
              guaranteeing forensic integrity.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>4. Patient Rights</h2>
            <p>
              Patients retain the right to download their full medical records, revoke sharing consent, and export
              signed digital prescriptions at any time through the Amrutam Patient Portal.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
