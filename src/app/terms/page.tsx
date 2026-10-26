import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-surface-raised)', minHeight: '100vh', padding: 'var(--space-12) 0' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <Link href="/" style={{ color: 'var(--color-border-muted)', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>
          ← Back to Amrutam Home
        </Link>

        <h1 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--color-text-primary)' }}>
          Telemedicine Practice Terms & Clinical Agreement
        </h1>

        <p style={{ color: '#555', fontSize: '14px', marginBottom: '28px' }}>
          Last Updated: January 2026 • Governing Law: Telemedicine Practice Guidelines, NMC Act & DISHA
        </p>

        <div className="amrutam-card" style={{ padding: 'var(--space-10)', display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: '26px', fontSize: '15px' }}>
          <section>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>1. Scope of Ayurvedic Telehealth Services</h2>
            <p>
              Amrutam Telemedicine provides a secure, encrypted digital platform facilitating remote clinical
              consultations between registered patients and board-certified Ayurvedic Vaidyas holding valid licenses
              registered with the National Medical Commission (NMC) or Central Council of Indian Medicine (CCIM).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>2. Concurrency & Slot Reservation Guarantee</h2>
            <p>
              When a patient initiates checkout for an appointment slot, the Amrutam engine establishes a temporary
              exclusive lock for a period of ten (10) minutes using distributed synchronization. If payment is completed
              within this window, the slot is permanently confirmed. If the hold lapses, the slot automatically returns
              to the public inventory to ensure fair access.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>3. Digital Prescription Authenticity</h2>
            <p>
              All Ayurvedic prescriptions generated through this platform are cryptographically sealed with a
              tamper-evident SHA-256 HMAC digital signature. Prescriptions are valid across licensed pharmacies in India
              in accordance with the Information Technology Act, 2000 and the Drugs and Cosmetics Act, 1940.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>4. Emergency Disclaimer</h2>
            <p>
              Telemedicine is not suitable for life-threatening medical emergencies, acute trauma, or severe poisonings.
              In any critical emergency, patients must immediately dial emergency services or report to the nearest hospital
              casualty department.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
