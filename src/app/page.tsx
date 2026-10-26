import React from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
import { DoctorCard } from '../components/doctors/DoctorCard';
import { Badge } from '../components/ui/Badge';

export const revalidate = 60; // revalidate every 60s

export default async function HomePage() {
  let doctors = [];
  try {
    doctors = await api.getDoctors();
  } catch (err) {
    console.warn('API currently connecting:', err);
    // Fallback seed doctors for client rendering if backend is offline during build
    doctors = [
      {
        id: 'd1111111-1111-1111-1111-111111111111',
        userId: 'u1',
        fullName: 'Dr. Vaidya Rajesh Sharma',
        email: 'dr.rajesh@amrutam.co.in',
        licenseNumber: 'AY-NMC-2009-4821',
        qualification: 'BAMS, MD (Ayurveda) - Kayachikitsa',
        primarySpecialty: 'Kayachikitsa (Internal Medicine)',
        secondarySpecialties: ['Digestive Disorders', 'Metabolic Syndrome', 'Agni Deepana'],
        experienceYears: 15,
        bio: 'Senior Ayurvedic Physician with 15 years of clinical mastery in gut health, chronic acidity, IBS, and metabolic harmony through classical herbal formulations.',
        consultationFee: 650,
        rating: 4.95,
        reviewCount: 342,
        isVerified: true,
      },
      {
        id: 'd2222222-2222-2222-2222-222222222222',
        userId: 'u2',
        fullName: 'Dr. Vaidya Ananya Deshmukh',
        email: 'dr.ananya@amrutam.co.in',
        licenseNumber: 'AY-CCIM-2012-8812',
        qualification: 'BAMS, MS (Ayurveda) - Shalakya Tantra',
        primarySpecialty: 'Shalakya Tantra (ENT & Eye Care)',
        secondarySpecialties: ['Migraine Management', 'Sinusitis', 'Computer Vision Syndrome'],
        experienceYears: 12,
        bio: 'Renowned practitioner specializing in supra-clavicular disorders, chronic sinusitis, tension migraines, and holistic eye therapies like Netra Tarpana guidance.',
        consultationFee: 750,
        rating: 4.92,
        reviewCount: 218,
        isVerified: true,
      },
      {
        id: 'd3333333-3333-3333-3333-333333333333',
        userId: 'u3',
        fullName: 'Dr. Vaidya Vikramaditya Joshi',
        email: 'dr.vikramaditya@amrutam.co.in',
        licenseNumber: 'AY-NMC-2006-1029',
        qualification: 'BAMS, Fellowship in Panchakarma (Kerala)',
        primarySpecialty: 'Panchakarma (Detoxification)',
        secondarySpecialties: ['Joint Pain & Arthritis', 'Stress & Insomnia', 'Cellular Rejuvenation'],
        experienceYears: 18,
        bio: 'Gold medalist in classical Panchakarma therapy. Guides structured home-based Shamana treatments and post-cleansing Rasayana rejuvenation regimens.',
        consultationFee: 900,
        rating: 4.98,
        reviewCount: 480,
        isVerified: true,
      },
    ];
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface-raised)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section
        style={{
          borderBottom: '1px solid rgba(58, 100, 59, 0.15)',
          paddingTop: 'var(--space-14)',
          paddingBottom: 'var(--space-13)',
          backgroundColor: 'var(--color-surface-muted)',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
              <Badge variant="success">
                National Medical Commission Verified Practitioners
              </Badge>
            </div>

            <h1
              style={{
                fontSize: '40px',
                lineHeight: '52px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-6)',
              }}
            >
              Ancient Ayurvedic Wisdom, Powered by Modern Clinical Telemedicine
            </h1>

            <p
              style={{
                fontSize: '18px',
                lineHeight: '28px',
                color: '#344334',
                marginBottom: 'var(--space-10)',
              }}
            >
              Consult board-certified Vaidyas for gut balance, chronic migraine, hormonal harmony,
              and holistic vitality. Enjoy zero double-booking distributed scheduling and
              cryptographically verifiable digital prescriptions.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link
                href="/doctors"
                style={{
                  backgroundColor: 'var(--color-text-primary)',
                  color: 'var(--color-surface-raised)',
                  padding: '14px 32px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '16px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Find a Doctor & Book Slot →
              </Link>
              <Link
                href="/patient"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-border-muted)',
                  border: '1.5px solid var(--color-border-muted)',
                  padding: '14px 28px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '16px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Patient Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Pillars */}
      <section style={{ padding: 'var(--space-13) 0', borderBottom: '1px solid rgba(58, 100, 59, 0.15)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-11)' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              Clinical Excellence Built for Patient Trust
            </h2>
            <p style={{ color: '#445544', fontSize: '16px' }}>
              Designed in full compliance with DISHA, ABDM, and the Telemedicine Practice Guidelines.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-8)',
            }}
          >
            <div className="amrutam-card" style={{ padding: 'var(--space-8)' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--color-border-muted)' }}>
                🔒
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Zero Double-Booking Guarantee</h3>
              <p style={{ fontSize: '14px', lineHeight: '22px', color: '#445544' }}>
                Powered by Redis Redlock distributed locks and PostgreSQL row-level concurrency locks.
                When you reserve a slot, it is held exclusively for you for 10 minutes.
              </p>
            </div>

            <div className="amrutam-card" style={{ padding: 'var(--space-8)' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--color-border-muted)' }}>
                🛡️
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>AES-256-GCM Envelope Encryption</h3>
              <p style={{ fontSize: '14px', lineHeight: '22px', color: '#445544' }}>
                All sensitive patient medical histories, Prakriti analyses, and clinical SOAP notes
                are protected using military-grade field-level authenticated envelope encryption.
              </p>
            </div>

            <div className="amrutam-card" style={{ padding: 'var(--space-8)' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--color-border-muted)' }}>
                📜
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>HMAC Digital Prescriptions</h3>
              <p style={{ fontSize: '14px', lineHeight: '22px', color: '#445544' }}>
                Every Ayurvedic prescription carries an immutable SHA-256 HMAC digital signature,
                verifying practitioner authenticity, exact herbal dosage, and Anupana carrier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Practitioners */}
      <section style={{ padding: 'var(--space-13) 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 'var(--space-10)',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '28px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                Featured Ayurvedic Vaidyas
              </h2>
              <p style={{ color: '#445544', fontSize: '15px' }}>
                Select a verified specialist to view available consultation slots.
              </p>
            </div>
            <Link
              href="/doctors"
              style={{
                color: 'var(--color-border-muted)',
                fontWeight: 700,
                fontSize: '15px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Browse All Practitioners →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-8)',
            }}
          >
            {doctors.slice(0, 3).map((doctor: any) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
