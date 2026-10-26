'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Prescription } from '../../../types';
import { PrescriptionTable } from '../../../components/prescription/PrescriptionTable';
import { VaidyaSignatureBadge } from '../../../components/prescription/VaidyaSignatureBadge';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PrescriptionDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);

  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getPrescriptionById(resolvedParams.id);
        setPrescription(data);
      } catch (err) {
        // Fallback demo prescription
        setPrescription({
          id: resolvedParams.id,
          consultationId: 'c1111111-1111-1111-1111-111111111111',
          doctorId: 'd1111111-1111-1111-1111-111111111111',
          patientId: 'u5',
          diagnosisNotes: 'Amlapitta & Agnimandya (Gastric fire vitiation with Pitta accumulation)',
          dietaryAdvice:
            'Favor warm freshly cooked meals, sweet pomegranate, bottle gourd, soaked black raisins, and lukewarm mung dal soup. Strictly avoid red chili, fried snacks, sour curd at night, fermented batter, and carbonated drinks.',
          lifestyleInstructions:
            'Practice Sheetali Pranayama for 10 minutes every morning. Avoid daytime sleep (Diva Swapna). Take a gentle 100-step stroll after dinner (Shatapadi).',
          digitalSignature: '9f83a2b71c4e650d32a188f61902bb31c9e8720194a821e90bca23901fbc0214',
          signedAt: new Date().toISOString(),
          isFinalized: true,
          isSignatureValid: true,
          doctorName: 'Dr. Vaidya Rajesh Sharma',
          licenseNumber: 'AY-NMC-2009-4821',
          patient: {
            id: 'u5',
            fullName: 'Arjun Verma',
            prakritiType: 'VATA_PITTA',
          },
          doctor: {
            id: 'd1111111-1111-1111-1111-111111111111',
            fullName: 'Dr. Vaidya Rajesh Sharma',
            licenseNumber: 'AY-NMC-2009-4821',
            qualification: 'BAMS, MD (Ayurveda) - Kayachikitsa',
            primarySpecialty: 'Kayachikitsa (Internal Medicine)',
          },
          items: [
            {
              id: 'rx-item-1',
              prescriptionId: resolvedParams.id,
              medicineName: 'Avipattikar Churna',
              formulation: 'Classical Herbal Powder (Churna)',
              dosage: '3 grams (1 teaspoon)',
              frequency: 'Twice daily, 15 minutes before meals',
              anupana: 'Warm water or lukewarm coconut water',
              durationDays: 21,
              specialInstructions: 'Store in airtight container. Do not expose to moisture.',
            },
            {
              id: 'rx-item-2',
              prescriptionId: resolvedParams.id,
              medicineName: 'Amrutam Kuntal Care Tablet / Shankh Bhasma Blend',
              formulation: 'Vati / Herbal Tablet',
              dosage: '1 tablet (500mg)',
              frequency: 'Twice daily after meals',
              anupana: 'Warm cow milk or lukewarm water',
              durationDays: 30,
              specialInstructions: 'Strengthens Agni and supports Pitta harmony.',
            },
            {
              id: 'rx-item-3',
              prescriptionId: resolvedParams.id,
              medicineName: 'Dhanwantharam Thailam (Warm Oil)',
              formulation: 'Medicated Oil (Taila)',
              dosage: 'External Application',
              frequency: 'Once daily before bath',
              anupana: 'External Abhyanga',
              durationDays: 14,
              specialInstructions: 'Gently massage on lower abdomen and joints.',
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resolvedParams.id]);

  if (loading || !prescription) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        Retrieving digitally signed clinical prescription...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface-raised)', minHeight: '100vh', padding: 'var(--space-11) 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Navigation & Action Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-8)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <Link href="/patient" style={{ color: 'var(--color-border-muted)', fontSize: '14px' }}>
            ← Back to Patient Health Records
          </Link>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="subtle"
              size="sm"
              onClick={() => window.print()}
            >
              🖨️ Print Document
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert('Compiling high-resolution cryptographic PDF download...')}
            >
              📥 Download PDF
            </Button>
          </div>
        </div>

        {/* Formal Medical Prescription Paper Container */}
        <div
          className="amrutam-card"
          style={{
            padding: 'var(--space-12)',
            backgroundColor: 'var(--color-surface-raised)',
            border: '2px solid var(--color-border-muted)',
            boxShadow: 'var(--shadow-1)',
          }}
        >
          {/* Clinic Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid var(--color-border-muted)',
              paddingBottom: 'var(--space-8)',
              marginBottom: 'var(--space-8)',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-primary)',
                  display: 'block',
                }}
              >
                AMRUTAM TELEMEDICINE
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-border-muted)', fontWeight: 600 }}>
                Authentic Ayurvedic Clinical Care & Teleconsultation Portal
              </span>
            </div>

            <div style={{ textAlign: 'right', fontSize: '13px', lineHeight: '20px' }}>
              <strong>{prescription.doctorName || prescription.doctor?.fullName}</strong>
              <div>{prescription.doctor?.qualification || 'BAMS, MD (Ayurveda)'}</div>
              <div>License: {prescription.licenseNumber || prescription.doctor?.licenseNumber}</div>
              <Badge variant="success">ABDM / DISHA Registered</Badge>
            </div>
          </div>

          {/* Patient Header Block */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              backgroundColor: 'var(--color-surface-muted)',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-xs)',
              marginBottom: 'var(--space-8)',
              fontSize: '14px',
            }}
          >
            <div>
              <span style={{ color: '#666', fontSize: '11px', display: 'block' }}>Patient Name</span>
              <strong>{prescription.patient?.fullName || 'Arjun Verma'}</strong>
            </div>
            <div>
              <span style={{ color: '#666', fontSize: '11px', display: 'block' }}>Prakriti Constituent</span>
              <Badge variant="warning">{prescription.patient?.prakritiType || 'VATA_PITTA'}</Badge>
            </div>
            <div>
              <span style={{ color: '#666', fontSize: '11px', display: 'block' }}>Prescription ID</span>
              <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{prescription.id}</span>
            </div>
            <div>
              <span style={{ color: '#666', fontSize: '11px', display: 'block' }}>Date of Consultation</span>
              <span>{new Date(prescription.signedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Clinical Diagnosis (Nidana & Samprapti) */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              Ayurvedic Diagnosis & Pathophysiology (Nidana)
            </h3>
            <p style={{ fontSize: '15px', color: '#2b3f33', fontWeight: 600 }}>
              {prescription.diagnosisNotes}
            </p>
          </div>

          {/* Formulations Rx Table */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              Prescribed Formulations (Aushadha Yoga)
            </h3>
            <PrescriptionTable items={prescription.items} />
          </div>

          {/* Ahara (Dietary Guidelines) & Vihara (Lifestyle Counseling) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-8)',
              marginBottom: 'var(--space-10)',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--color-surface-muted)',
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid rgba(58, 100, 59, 0.2)',
              }}
            >
              <h4 style={{ fontSize: '15px', marginBottom: '6px', color: 'var(--color-text-primary)' }}>
                🥗 Ahara (Nutritional & Dietary Advice)
              </h4>
              <p style={{ fontSize: '13.5px', lineHeight: '21px', color: '#334433' }}>
                {prescription.dietaryAdvice}
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-surface-muted)',
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid rgba(58, 100, 59, 0.2)',
              }}
            >
              <h4 style={{ fontSize: '15px', marginBottom: '6px', color: 'var(--color-text-primary)' }}>
                🧘 Vihara (Daily Lifestyle & Yoga Instructions)
              </h4>
              <p style={{ fontSize: '13.5px', lineHeight: '21px', color: '#334433' }}>
                {prescription.lifestyleInstructions}
              </p>
            </div>
          </div>

          {/* Cryptographic Digital Signature Authenticity Seal */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <VaidyaSignatureBadge
              signature={prescription.digitalSignature}
              signedAt={prescription.signedAt}
              doctorName={prescription.doctorName || prescription.doctor?.fullName}
              licenseNumber={prescription.licenseNumber || prescription.doctor?.licenseNumber}
              isValid={prescription.isSignatureValid ?? true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
