'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { Consultation, Prescription } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function PatientPortalPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cList, pList] = await Promise.all([
          api.getConsultations(),
          api.getPatientPrescriptions('55555555-5555-5555-5555-555555555555'),
        ]);
        setConsultations(cList);
        setPrescriptions(pList);
      } catch (err) {
        // Fallback for standalone demo
        setConsultations([
          {
            id: 'c1111111-1111-1111-1111-111111111111',
            patientId: 'u5',
            doctorId: 'd1111111-1111-1111-1111-111111111111',
            scheduledStartTime: new Date(Date.now() - 3600000).toISOString(),
            scheduledEndTime: new Date(Date.now() - 1800000).toISOString(),
            status: 'COMPLETED',
            roomSessionToken: 'session_demo_1',
            doctorName: 'Dr. Vaidya Rajesh Sharma',
            specialty: 'Kayachikitsa (Internal Medicine)',
          },
          {
            id: 'c2222222-2222-2222-2222-222222222222',
            patientId: 'u5',
            doctorId: 'd2222222-2222-2222-2222-222222222222',
            scheduledStartTime: new Date(Date.now() + 86400000).toISOString(),
            scheduledEndTime: new Date(Date.now() + 86400000 + 1800000).toISOString(),
            status: 'SCHEDULED',
            roomSessionToken: 'session_demo_2',
            doctorName: 'Dr. Vaidya Ananya Deshmukh',
            specialty: 'Shalakya Tantra (ENT & Eye Care)',
          },
        ]);
        setPrescriptions([
          {
            id: 'rx111111-1111-1111-1111-111111111111',
            consultationId: 'c1111111-1111-1111-1111-111111111111',
            doctorId: 'd1111111-1111-1111-1111-111111111111',
            patientId: 'u5',
            diagnosisNotes: 'Amlapitta & Agnimandya',
            dietaryAdvice: 'Favor warm cooked foods and mung dal.',
            lifestyleInstructions: 'Practice Sheetali Pranayama.',
            digitalSignature: '9f83a2b71c4e650d32a188f61902bb31c9e8720194a821e90bca23901fbc0214',
            signedAt: new Date(Date.now() - 3600000).toISOString(),
            isFinalized: true,
            doctorName: 'Dr. Vaidya Rajesh Sharma',
            licenseNumber: 'AY-NMC-2009-4821',
            items: [],
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-surface-raised)', minHeight: '100vh', padding: 'var(--space-11) 0' }}>
      <div className="container">
        {/* Patient Profile Card */}
        <div
          className="amrutam-card"
          style={{
            padding: 'var(--space-8)',
            marginBottom: 'var(--space-10)',
            backgroundColor: 'var(--color-surface-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '24px', color: 'var(--color-text-primary)' }}>
                Arjun Verma
              </h1>
              <Badge variant="warning">Prakriti: VATA_PITTA</Badge>
              <Badge variant="success">ABHA ID: 91-4428-1902-8812</Badge>
            </div>
            <p style={{ fontSize: '14px', color: '#556b2f' }}>
              Ayurvedic Health Record • Registered Patient since January 2025
            </p>
          </div>

          <Link
            href="/doctors"
            style={{
              backgroundColor: 'var(--color-text-primary)',
              color: 'var(--color-surface-raised)',
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            + Book New Consultation
          </Link>
        </div>

        {/* Consultations Section */}
        <div style={{ marginBottom: 'var(--space-11)' }}>
          <h2 style={{ fontSize: '22px', marginBottom: 'var(--space-6)', color: 'var(--color-text-primary)' }}>
            My Consultations & Appointments
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {consultations.map((c) => (
              <div
                key={c.id}
                className="amrutam-card"
                style={{
                  padding: 'var(--space-8)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Badge variant={c.status === 'COMPLETED' ? 'success' : 'info'}>
                      ● {c.status}
                    </Badge>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {new Date(c.scheduledStartTime).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '17px', color: 'var(--color-text-primary)' }}>
                    {c.doctorName || 'Vaidya Specialist'}
                  </h3>
                  <span style={{ fontSize: '13px', color: 'var(--color-border-muted)', fontWeight: 600 }}>
                    {c.specialty}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href={`/consultation/${c.id}`}
                    style={{
                      backgroundColor: 'var(--color-text-primary)',
                      color: 'var(--color-surface-raised)',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Enter Room / Notes →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Prescriptions Section */}
        <div>
          <h2 style={{ fontSize: '22px', marginBottom: 'var(--space-6)', color: 'var(--color-text-primary)' }}>
            Active Digital Ayurvedic Prescriptions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {prescriptions.map((p) => (
              <div
                key={p.id}
                className="amrutam-card"
                style={{
                  padding: 'var(--space-8)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Badge variant="success">✓ HMAC-SHA256 Signed</Badge>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      Prescription Date: {new Date(p.signedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '17px', color: 'var(--color-text-primary)' }}>
                    {p.doctorName || 'Dr. Vaidya Rajesh Sharma'} ({p.licenseNumber})
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#444' }}>
                    Diagnosis: <strong>{p.diagnosisNotes}</strong>
                  </p>
                </div>

                <Link
                  href={`/prescriptions/${p.id}`}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-border-muted)',
                    border: '1.5px solid var(--color-border-muted)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  View Prescription & Herbal Schedule →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
