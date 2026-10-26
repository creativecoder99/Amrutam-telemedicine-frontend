'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Doctor, AvailabilitySlot } from '../../../types';
import { SlotPicker } from '../../../components/booking/SlotPicker';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DoctorProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [holdingSlotId, setHoldingSlotId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [docData, slotsData] = await Promise.all([
          api.getDoctorById(resolvedParams.id),
          api.getDoctorSlots(resolvedParams.id),
        ]);
        setDoctor(docData);
        setSlots(slotsData);
      } catch (err) {
        // Fallback for standalone demo mode
        const fallbackDoc: Doctor = {
          id: resolvedParams.id,
          userId: 'u1',
          fullName: 'Dr. Vaidya Rajesh Sharma',
          email: 'dr.rajesh@amrutam.co.in',
          licenseNumber: 'AY-NMC-2009-4821',
          qualification: 'BAMS, MD (Ayurveda) - Kayachikitsa',
          primarySpecialty: 'Kayachikitsa (Internal Medicine)',
          secondarySpecialties: ['Digestive Disorders', 'Metabolic Syndrome', 'Agni Deepana'],
          experienceYears: 15,
          bio: 'Senior Ayurvedic Physician with 15 years of clinical mastery in gut health, chronic acidity, IBS, and metabolic harmony through classical herbal formulations. Trained in traditional Nadi Pariksha and personalized Ahara-Vihara counseling.',
          consultationFee: 650,
          rating: 4.95,
          reviewCount: 342,
          isVerified: true,
        };

        const now = new Date();
        const fallbackSlots: AvailabilitySlot[] = [];
        for (let d = 0; d < 7; d++) {
          const date = new Date(now.getTime() + d * 86400000);
          for (const h of [10, 11, 14, 15, 17]) {
            const start = new Date(date);
            start.setHours(h, 0, 0, 0);
            const end = new Date(start.getTime() + 30 * 60 * 1000);
            fallbackSlots.push({
              id: `slot-fallback-${d}-${h}`,
              doctorId: resolvedParams.id,
              startTime: start.toISOString(),
              endTime: end.toISOString(),
              status: 'AVAILABLE',
            });
          }
        }

        setDoctor(fallbackDoc);
        setSlots(fallbackSlots);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [resolvedParams.id]);

  const handleSlotSelect = async (slot: AvailabilitySlot) => {
    setErrorMessage(null);
    setHoldingSlotId(slot.id);

    try {
      // 1. Acquire Distributed Lock and Hold Slot for 10 minutes
      const result = await api.holdSlot(slot.id);

      // 2. Redirect to Checkout with active hold parameters
      router.push(
        `/checkout?slotId=${slot.id}&doctorId=${resolvedParams.id}&expiresAt=${encodeURIComponent(
          result.holdExpiresAt || new Date(Date.now() + 600000).toISOString()
        )}`
      );
    } catch (err) {
      setErrorMessage(
        (err as Error).message ||
          'This slot was held by another patient milliseconds before you. Please pick another available time.'
      );
      setHoldingSlotId(null);
    }
  };

  if (loading || !doctor) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        Loading practitioner profile and calendar schedule...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface-raised)', minHeight: '100vh', padding: 'var(--space-11) 0' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav style={{ marginBottom: 'var(--space-8)', fontSize: '14px' }}>
          <Link href="/doctors" style={{ color: 'var(--color-border-muted)' }}>
            ← Back to All Practitioners
          </Link>
        </nav>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: 'var(--color-status-error-bg)',
              border: '1.5px solid var(--color-status-error)',
              borderRadius: 'var(--radius-xs)',
              color: 'var(--color-status-error)',
              marginBottom: 'var(--space-8)',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Doctor Header Banner */}
        <div
          className="amrutam-card"
          style={{
            padding: 'var(--space-10)',
            marginBottom: 'var(--space-10)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div style={{ maxWidth: '720px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <Badge variant="success">✓ Verified by National Medical Commission</Badge>
              <Badge variant="neutral">License: {doctor.licenseNumber}</Badge>
            </div>

            <h1 style={{ fontSize: '32px', marginBottom: '6px', color: 'var(--color-text-primary)' }}>
              {doctor.fullName}
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--color-border-muted)', fontWeight: 600, marginBottom: '14px' }}>
              {doctor.qualification} • {doctor.experienceYears} Years Clinical Practice
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              <Badge variant="info">{doctor.primarySpecialty}</Badge>
              {doctor.secondarySpecialties.map((spec) => (
                <Badge key={spec} variant="neutral">
                  {spec}
                </Badge>
              ))}
            </div>

            <p style={{ fontSize: '15px', lineHeight: '24px', color: '#334433' }}>{doctor.bio}</p>
          </div>

          <div
            style={{
              padding: 'var(--space-8)',
              backgroundColor: 'var(--color-surface-muted)',
              border: '1px solid rgba(58, 100, 59, 0.25)',
              borderRadius: 'var(--radius-sm)',
              minWidth: '220px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#666', letterSpacing: '0.04em' }}>
              Video Consultation Fee
            </span>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-text-primary)', margin: '4px 0' }}>
              ₹{doctor.consultationFee}
            </div>
            <span style={{ fontSize: '12px', color: '#556b2f' }}>30 Minutes Clinical Session</span>
            <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: 600, color: '#855309' }}>
              ★ {doctor.rating.toFixed(2)} ({doctor.reviewCount} Patient Reviews)
            </div>
          </div>
        </div>

        {/* Slot Picker */}
        <SlotPicker
          slots={slots}
          selectedSlotId={holdingSlotId}
          onSlotSelect={handleSlotSelect}
          isLoading={holdingSlotId !== null}
        />
      </div>
    </div>
  );
}
