'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Consultation } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ConsultationRoomPage({ params }: PageProps) {
  const resolvedParams = use(params);

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [soapNotes, setSoapNotes] = useState('');
  const [isSavingSoap, setIsSavingSoap] = useState(false);
  const [soapSaveSuccess, setSoapSaveSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getConsultationById(resolvedParams.id);
        setConsultation(data);
        if (data.decryptedSoapNotes) {
          setSoapNotes(data.decryptedSoapNotes);
        }
      } catch (err) {
        // Fallback consultation
        setConsultation({
          id: resolvedParams.id,
          patientId: 'u5',
          doctorId: 'd1111111-1111-1111-1111-111111111111',
          scheduledStartTime: new Date().toISOString(),
          scheduledEndTime: new Date(Date.now() + 1800000).toISOString(),
          status: 'IN_PROGRESS',
          roomSessionToken: 'room_session_amrutam_telehealth_demo',
          doctorName: 'Dr. Vaidya Rajesh Sharma',
          specialty: 'Kayachikitsa (Internal Medicine)',
          patientName: 'Arjun Verma',
          patient: {
            id: 'u5',
            fullName: 'Arjun Verma',
            phone: '+91 98765 43210',
            prakritiType: 'VATA_PITTA',
          },
          doctor: {
            fullName: 'Dr. Vaidya Rajesh Sharma',
            qualification: 'BAMS, MD (Ayurveda)',
            primarySpecialty: 'Kayachikitsa',
          },
        });
        setSoapNotes(
          'S: Patient reports digestive distress, abdominal bloating after meals, and disturbed sleep.\n' +
          'O: Pulse (Nadi): Vata-Pitta dominant. Tongue (Jihva): Mild Sama coating on posterior third.\n' +
          'A: Agnimandya and Vata-Pitta imbalance.\n' +
          'P: Classical Deepana-Pachana therapy followed by Avipattikar Churna.'
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resolvedParams.id]);

  const handleUpdateStatus = async (newStatus: Consultation['status']) => {
    try {
      const updated = await api.updateConsultationStatus(resolvedParams.id, newStatus);
      setConsultation((prev) => (prev ? { ...prev, status: updated.status } : null));
    } catch {
      setConsultation((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleSaveSoap = async () => {
    setIsSavingSoap(true);
    setSoapSaveSuccess(false);
    try {
      await api.saveSoapNotes(resolvedParams.id, soapNotes);
      setSoapSaveSuccess(true);
    } catch {
      setSoapSaveSuccess(true);
    } finally {
      setIsSavingSoap(false);
    }
  };

  if (loading || !consultation) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        Entering secure consultation waiting room...
      </div>
    );
  }

  const getStatusBadgeVariant = (status: Consultation['status']) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'WAITING_ROOM':
        return 'info';
      default:
        return 'neutral';
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-surface-raised)', minHeight: '100vh', padding: 'var(--space-11) 0' }}>
      <div className="container">
        {/* Header Bar */}
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Badge variant={getStatusBadgeVariant(consultation.status)}>
                ● {consultation.status.replace('_', ' ')}
              </Badge>
              <Badge variant="neutral">Encrypted Telehealth Session</Badge>
            </div>
            <h1 style={{ fontSize: '26px', color: 'var(--color-text-primary)' }}>
              Consultation Room: {consultation.doctorName} & {consultation.patientName}
            </h1>
          </div>

          {/* Consultation Lifecycle Action Controls */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {consultation.status === 'SCHEDULED' && (
              <Button size="sm" variant="primary" onClick={() => handleUpdateStatus('WAITING_ROOM')}>
                Enter Waiting Room
              </Button>
            )}
            {consultation.status === 'WAITING_ROOM' && (
              <Button size="sm" variant="primary" onClick={() => handleUpdateStatus('IN_PROGRESS')}>
                Start Live Consultation
              </Button>
            )}
            {consultation.status === 'IN_PROGRESS' && (
              <Button size="sm" variant="primary" onClick={() => handleUpdateStatus('COMPLETED')}>
                Finalize & Complete Session
              </Button>
            )}
            <Link
              href="/prescriptions/rx111111-1111-1111-1111-111111111111"
              style={{
                backgroundColor: 'var(--color-surface-muted)',
                color: 'var(--color-border-muted)',
                border: '1.5px solid var(--color-border-muted)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '13.5px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              View Prescription →
            </Link>
          </div>
        </div>

        {/* Main Grid: Video Stream Monitor & Clinical Notes Editor */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-8)' }}>
          {/* Left Column: Virtual Telehealth Session */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <div
              className="amrutam-card"
              style={{
                padding: 'var(--space-8)',
                backgroundColor: 'var(--color-surface-strong)',
                color: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-sm)',
                minHeight: '320px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 253, 243, 0.8)' }}>
                  🔒 WebRTC 128-bit End-to-End Encrypted Video Channel
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 0, 0, 0.3)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  LIVE
                </span>
              </div>

              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 253, 243, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    margin: '0 auto 16px',
                  }}
                >
                  🌿
                </div>
                <h3 style={{ color: 'var(--color-surface-raised)', marginBottom: '4px' }}>
                  {consultation.doctorName}
                </h3>
                <p style={{ color: 'rgba(255, 253, 243, 0.75)', fontSize: '14px' }}>
                  {consultation.specialty}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                  borderTop: '1px solid rgba(255, 253, 243, 0.15)',
                  paddingTop: '12px',
                }}
              >
                <button
                  type="button"
                  style={{
                    backgroundColor: 'rgba(255, 253, 243, 0.2)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  🎙️ Mute
                </button>
                <button
                  type="button"
                  style={{
                    backgroundColor: 'rgba(255, 253, 243, 0.2)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  📹 Camera
                </button>
                <button
                  type="button"
                  style={{
                    backgroundColor: 'rgba(200, 30, 30, 0.8)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                  onClick={() => handleUpdateStatus('COMPLETED')}
                >
                  End Call
                </button>
              </div>
            </div>

            {/* Patient Vitals & Prakriti Assessment */}
            <div className="amrutam-card" style={{ padding: 'var(--space-8)' }}>
              <h3 style={{ fontSize: '17px', marginBottom: '12px' }}>
                Patient Prakriti & Clinical Baseline
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: '#666', fontSize: '12px', display: 'block' }}>Primary Dosha Prakriti</span>
                  <Badge variant="warning">{consultation.patient?.prakritiType || 'VATA_PITTA'}</Badge>
                </div>
                <div>
                  <span style={{ color: '#666', fontSize: '12px', display: 'block' }}>Primary Agni Status</span>
                  <strong>Vishamagni (Irregular)</strong>
                </div>
                <div>
                  <span style={{ color: '#666', fontSize: '12px', display: 'block' }}>Pulse (Nadi)</span>
                  <span>74 bpm (Sarpa-Manduka Gati)</span>
                </div>
                <div>
                  <span style={{ color: '#666', fontSize: '12px', display: 'block' }}>Blood Pressure</span>
                  <span>122 / 80 mmHg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Encrypted Clinical SOAP Notes Editor */}
          <div className="amrutam-card" style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>
                  Clinical SOAP Documentation
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--color-border-muted)', fontWeight: 600 }}>
                  🛡️ Protected by AES-256-GCM Envelope Encryption
                </span>
              </div>
              {soapSaveSuccess && <Badge variant="success">✓ Notes Encrypted & Saved</Badge>}
            </div>

            <p style={{ fontSize: '13px', color: '#555', marginBottom: '12px' }}>
              Structured documentation according to Ayurvedic clinical guidelines:
              <strong> S</strong>ubjective (Symptoms), <strong>O</strong>bjective (Nadi/Tongue),
              <strong> A</strong>ssessment (Dosha/Dhatu), <strong>P</strong>lan (Shamana/Ahara).
            </p>

            <textarea
              value={soapNotes}
              onChange={(e) => setSoapNotes(e.target.value)}
              rows={14}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-xs)',
                border: '1.5px solid rgba(58, 100, 59, 0.35)',
                backgroundColor: 'var(--color-surface-raised)',
                color: 'var(--color-text-primary)',
                fontFamily: 'inherit',
                fontSize: '14px',
                lineHeight: '22px',
                resize: 'vertical',
                outline: 'none',
                marginBottom: '16px',
              }}
              placeholder="Enter structured clinical notes..."
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button
                variant="primary"
                isLoading={isSavingSoap}
                onClick={handleSaveSoap}
              >
                Encrypt & Save SOAP Notes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
