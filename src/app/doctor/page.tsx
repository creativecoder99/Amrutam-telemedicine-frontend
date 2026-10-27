'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { Doctor, AvailabilitySlot, Consultation, Wallet, PayoutRequest } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../lib/auth-context';

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'wallet' | 'availability' | 'appointments'>('wallet');

  // Doctor profile & status
  const doctorId = user.doctorId || 'd1111111-1111-1111-1111-111111111111';
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [payoutHistory, setPayoutHistory] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Slot generation state
  const [generatingSlots, setGeneratingSlots] = useState(false);
  const [slotMessage, setSlotMessage] = useState('');

  // Payout request modal state
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(1000);
  const [payoutMethod, setPayoutMethod] = useState<'UPI' | 'BANK'>('UPI');
  const [payoutUpi, setPayoutUpi] = useState('drrajesh@okhdfcbank');
  const [payoutBank, setPayoutBank] = useState({
    bankName: 'HDFC Bank',
    accountNumber: '50100234567890',
    ifscCode: 'HDFC0001234',
    accountHolderName: user.fullName || 'Dr. Vaidya Rajesh Sharma',
  });
  const [payoutSubmitting, setPayoutSubmitting] = useState(false);
  const [payoutError, setPayoutError] = useState('');
  const [payoutSuccess, setPayoutSuccess] = useState('');

  const loadDoctorData = async () => {
    setLoading(true);
    try {
      const [docData, docSlots, cList, docWallet, history] = await Promise.all([
        api.getDoctorById(doctorId).catch(() => null),
        api.getDoctorSlots(doctorId).catch(() => []),
        api.getConsultations().catch(() => []),
        api.getDoctorWallet(doctorId).catch(() => ({
          id: 'w-default',
          doctorId,
          balance: 1200,
          totalEarned: 1200,
          updatedAt: new Date().toISOString(),
          thresholdInr: 1000,
        })),
        api.getDoctorPayoutHistory(doctorId).catch(() => []),
      ]);

      if (docData) setDoctor(docData);
      setSlots(docSlots);
      setConsultations(cList.filter((c) => c.doctorId === doctorId));
      setWallet(docWallet);
      setPayoutHistory(history);
    } catch (err) {
      console.warn('Fallback doctor data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, [doctorId, user]);

  // Handle slot generation
  const handleGenerateSlots = async () => {
    setGeneratingSlots(true);
    setSlotMessage('');
    try {
      const res = await api.generateDoctorSlots(doctorId, 14);
      setSlotMessage(`✓ Successfully generated ${res.count} consultation slots for the next 14 days.`);
      const updatedSlots = await api.getDoctorSlots(doctorId);
      setSlots(updatedSlots);
    } catch (err) {
      setSlotMessage(`⚠ ${(err as Error).message || 'Failed to generate slots.'}`);
    } finally {
      setGeneratingSlots(false);
    }
  };

  // Handle payout submission
  const handleSubmitPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutSubmitting(true);
    setPayoutError('');
    setPayoutSuccess('');

    try {
      const accountDetails =
        payoutMethod === 'UPI'
          ? { upiId: payoutUpi }
          : {
              bankName: payoutBank.bankName,
              accountNumber: payoutBank.accountNumber,
              ifscCode: payoutBank.ifscCode,
              accountHolderName: payoutBank.accountHolderName,
            };

      const result = await api.requestPayout(doctorId, payoutAmount, accountDetails);
      setPayoutSuccess(`✓ Payout request of ₹${result.amount.toLocaleString()} submitted to Clinical Governance Admin.`);
      setIsPayoutModalOpen(false);

      // Refresh wallet & history
      await loadDoctorData();
    } catch (err) {
      setPayoutError((err as Error).message || 'Payout request failed.');
    } finally {
      setPayoutSubmitting(false);
    }
  };

  const currentStatus = doctor?.verificationStatus || user.verificationStatus || 'VERIFIED';
  const isVerified = currentStatus === 'VERIFIED';
  const balance = wallet?.balance ?? 1200;
  const threshold = wallet?.thresholdInr ?? 1000;
  const isEligibleForPayout = balance >= threshold;

  return (
    <div style={{ backgroundColor: 'var(--color-surface-raised)', minHeight: '100vh', padding: 'var(--space-8) 0' }}>
      <div className="container">
        {/* Top Header Card */}
        <div
          className="amrutam-card"
          style={{
            padding: '28px',
            marginBottom: '24px',
            backgroundColor: 'var(--color-surface-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            border: '1px solid rgba(58, 100, 59, 0.2)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '24px', color: 'var(--color-text-primary)', margin: 0 }}>
                {doctor?.fullName || user.fullName || 'Dr. Vaidya Rajesh Sharma'}
              </h1>

              {isVerified ? (
                <Badge variant="success">✓ Verified Ayurvedic Practitioner</Badge>
              ) : currentStatus === 'PENDING_VERIFICATION' ? (
                <Badge variant="warning">⏳ Pending Admin KYC Verification</Badge>
              ) : (
                <Badge variant="danger">✖ Verification Rejected</Badge>
              )}
            </div>

            <p style={{ fontSize: '14px', color: '#556b2f', margin: 0 }}>
              {doctor?.primarySpecialty || 'Kayachikitsa (Internal Medicine)'} • License:{' '}
              {doctor?.licenseNumber || 'AY-NMC-2009-4821'} • Fee: ₹{doctor?.consultationFee || 500}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link
              href="/doctor/register"
              style={{
                fontSize: '13px',
                color: 'var(--color-primary-dark)',
                textDecoration: 'none',
                fontWeight: 600,
                border: '1px solid var(--color-primary-dark)',
                padding: '6px 12px',
                borderRadius: '4px',
              }}
            >
              + Submit New Registration
            </Link>
          </div>
        </div>

        {/* Verification Warning Banner if Pending */}
        {!isVerified && (
          <div
            style={{
              padding: '18px 22px',
              backgroundColor: '#fffbeb',
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              marginBottom: '24px',
              color: '#92400e',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <strong style={{ fontSize: '16px' }}>
                {currentStatus === 'PENDING_VERIFICATION'
                  ? 'Application Under Review by Clinical Governance Admin'
                  : 'Practitioner Application Status: Rejected'}
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
              {currentStatus === 'PENDING_VERIFICATION' ? (
                <>
                  Your medical license, degree certificates, and identity proofs have been queued for administrative review.
                  In accordance with AYUSH telemedicine regulations, <strong>posting availability slots and accepting patient appointments</strong> remain locked until the Admin approves your profile.
                  <span style={{ display: 'block', marginTop: '6px' }}>
                    👉 You can switch to the <strong>Admin Center</strong> from the header switcher to verify this application!
                  </span>
                </>
              ) : (
                <>
                  Reason for rejection:{' '}
                  <strong>{doctor?.rejectionReason || 'Credentials could not be verified with AYUSH registry.'}</strong>
                </>
              )}
            </p>
          </div>
        )}

        {payoutSuccess && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: '6px',
              color: '#065f46',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {payoutSuccess}
          </div>
        )}

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            borderBottom: '2px solid rgba(58, 100, 59, 0.15)',
            marginBottom: '28px',
          }}
        >
          <button
            onClick={() => setActiveTab('wallet')}
            style={{
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: 600,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'wallet' ? 'var(--color-primary-dark)' : 'var(--color-border-muted)',
              borderBottom: activeTab === 'wallet' ? '3px solid var(--color-primary-dark)' : '3px solid transparent',
              marginBottom: '-2px',
            }}
          >
            Earnings & Payout Wallet (₹200/Patient)
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            style={{
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: 600,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'availability' ? 'var(--color-primary-dark)' : 'var(--color-border-muted)',
              borderBottom: activeTab === 'availability' ? '3px solid var(--color-primary-dark)' : '3px solid transparent',
              marginBottom: '-2px',
            }}
          >
            Slot Availability Management ({slots.length})
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            style={{
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: 600,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'appointments' ? 'var(--color-primary-dark)' : 'var(--color-border-muted)',
              borderBottom: activeTab === 'appointments' ? '3px solid var(--color-primary-dark)' : '3px solid transparent',
              marginBottom: '-2px',
            }}
          >
            Appointments & Consultations ({consultations.length})
          </button>
        </div>

        {/* TAB 1: Wallet & Payout Section */}
        {activeTab === 'wallet' && (
          <div>
            {/* Wallet Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              {/* Card 1: Balance */}
              <div className="amrutam-card" style={{ padding: '24px', backgroundColor: 'var(--color-surface-muted)' }}>
                <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Available Wallet Balance
                </span>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary-dark)', margin: '6px 0 4px 0' }}>
                  ₹{balance.toLocaleString()}
                </div>
                <span style={{ fontSize: '12px', color: '#065f46' }}>
                  Earns ₹200 for every completed patient consultation
                </span>
              </div>

              {/* Card 2: Payout Eligibility & Threshold */}
              <div className="amrutam-card" style={{ padding: '24px', backgroundColor: 'var(--color-surface-muted)' }}>
                <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Payout Threshold (Min ₹1,000)
                </span>
                <div style={{ margin: '8px 0 10px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span>Progress to ₹1,000 Threshold:</span>
                    <strong>{Math.min(100, Math.round((balance / threshold) * 100))}%</strong>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, (balance / threshold) * 100)}%`,
                        backgroundColor: isEligibleForPayout ? '#10b981' : '#f59e0b',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: isEligibleForPayout ? '#065f46' : '#92400e' }}>
                    {isEligibleForPayout ? '✓ Eligible to withdraw' : `Need ₹${threshold - balance} more to unlock payout`}
                  </span>

                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!isEligibleForPayout}
                    onClick={() => {
                      setPayoutAmount(Math.max(1000, balance));
                      setIsPayoutModalOpen(true);
                    }}
                  >
                    Request Payout
                  </Button>
                </div>
              </div>

              {/* Card 3: Total Cumulative Earned */}
              <div className="amrutam-card" style={{ padding: '24px', backgroundColor: 'var(--color-surface-muted)' }}>
                <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Lifetime Earned
                </span>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-primary)', margin: '6px 0 4px 0' }}>
                  ₹{(wallet?.totalEarned ?? 1200).toLocaleString()}
                </div>
                <span style={{ fontSize: '12px', color: '#4b5563' }}>
                  Calculated from verified completed sessions
                </span>
              </div>
            </div>

            {/* Payout History Table */}
            <div className="amrutam-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)', margin: 0 }}>
                  Payout Requests & Settlement History
                </h3>
                {isEligibleForPayout && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPayoutAmount(Math.max(1000, balance));
                      setIsPayoutModalOpen(true);
                    }}
                  >
                    + New Payout Request
                  </Button>
                )}
              </div>

              {payoutHistory.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                  No payout requests recorded yet. Your current balance is ₹{balance.toLocaleString()}. You can request a payout anytime when balance $\ge$ ₹1,000.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--color-surface-muted)', textAlign: 'left' }}>
                        <th style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>Request ID</th>
                        <th style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>Requested Amount</th>
                        <th style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>Destination</th>
                        <th style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                        <th style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                        <th style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>Admin Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payoutHistory.map((p) => (
                        <tr key={p.id}>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6', fontFamily: 'monospace' }}>
                            {p.id}
                          </td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                            ₹{p.amount.toLocaleString()}
                          </td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
                            {p.accountDetails.upiId ? `UPI: ${p.accountDetails.upiId}` : `Bank: ${p.accountDetails.accountNumber}`}
                          </td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>
                            {new Date(p.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
                            <Badge
                              variant={
                                p.status === 'PROCESSED' ? 'success' : p.status === 'PENDING' ? 'warning' : 'danger'
                              }
                            >
                              {p.status}
                            </Badge>
                          </td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6', color: '#4b5563', fontSize: '12px' }}>
                            {p.adminNotes || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Availability & Slots */}
        {activeTab === 'availability' && (
          <div>
            <div
              className="amrutam-card"
              style={{
                padding: '24px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)', margin: 0 }}>
                  Post & Manage Teleconsultation Slots
                </h3>
                <p style={{ fontSize: '13px', color: '#556b2f', margin: '4px 0 0 0' }}>
                  Generate 14-day rolling inventory. Unverified practitioners cannot publish availability.
                </p>
              </div>

              <div>
                <Button
                  variant="primary"
                  disabled={!isVerified || generatingSlots}
                  onClick={handleGenerateSlots}
                >
                  {generatingSlots ? 'Generating...' : '+ Generate 14-Day Slots'}
                </Button>
              </div>
            </div>

            {slotMessage && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: slotMessage.startsWith('✓') ? '#ecfdf5' : '#fef2f2',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  fontSize: '14px',
                }}
              >
                {slotMessage}
              </div>
            )}

            <div className="amrutam-card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '16px', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
                Current Slot Inventory ({slots.length} Total)
              </h4>

              {slots.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                  {isVerified
                    ? "No slots published yet. Click '+ Generate 14-Day Slots' above to open your calendar."
                    : 'Slot generation is disabled until Admin approves your KYC verification.'}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {slots.slice(0, 24).map((slot) => {
                    const start = new Date(slot.startTime);
                    return (
                      <div
                        key={slot.id}
                        style={{
                          padding: '12px',
                          border: '1px solid rgba(58, 100, 59, 0.2)',
                          borderRadius: '6px',
                          backgroundColor:
                            slot.status === 'AVAILABLE'
                              ? '#f0fdf4'
                              : slot.status === 'HELD'
                              ? '#fffbeb'
                              : '#fef2f2',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                            {start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', weekday: 'short' })}
                          </span>
                          <Badge
                            variant={
                              slot.status === 'AVAILABLE' ? 'success' : slot.status === 'HELD' ? 'warning' : 'danger'
                            }
                          >
                            {slot.status}
                          </Badge>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>
                          {start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Appointments */}
        {activeTab === 'appointments' && (
          <div className="amrutam-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
              Patient Appointments & Clinical Encounters
            </h3>

            {consultations.length === 0 ? (
              <p style={{ color: '#6b7280' }}>No scheduled appointments for your account at this moment.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {consultations.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '16px',
                      border: '1px solid rgba(58, 100, 59, 0.2)',
                      borderRadius: '6px',
                      backgroundColor: 'var(--color-surface-muted)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>
                          {c.patientName || 'Patient Arjun Verma'}
                        </strong>
                        <Badge
                          variant={
                            c.status === 'COMPLETED' ? 'success' : c.status === 'SCHEDULED' ? 'warning' : 'info'
                          }
                        >
                          {c.status}
                        </Badge>
                      </div>
                      <div style={{ fontSize: '13px', color: '#556b2f' }}>
                        {new Date(c.scheduledStartTime).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link
                        href={`/consultation/${c.id}`}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'var(--color-primary-dark)',
                          color: '#fff',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: 600,
                        }}
                      >
                        Launch Clinical Room
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal: Request Payout */}
        {isPayoutModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
          >
            <div
              className="amrutam-card"
              style={{
                maxWidth: '520px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '28px',
                backgroundColor: 'var(--color-surface-raised)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--color-text-primary)', margin: 0 }}>
                  Request Doctor Remuneration Payout
                </h3>
                <button
                  onClick={() => setIsPayoutModalOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666' }}
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-surface-muted)',
                  padding: '14px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '13px',
                }}
              >
                <div>Available Wallet Balance: <strong>₹{balance.toLocaleString()}</strong></div>
                <div>Minimum Payout Threshold: <strong>₹1,000</strong></div>
                <div style={{ color: '#065f46', marginTop: '4px' }}>
                  Consultation remuneration rate: ₹200 credited per patient consultation.
                </div>
              </div>

              {payoutError && (
                <div
                  style={{
                    padding: '10px 14px',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #ef4444',
                    borderRadius: '4px',
                    color: '#991b1b',
                    marginBottom: '14px',
                    fontSize: '13px',
                  }}
                >
                  ⚠ {payoutError}
                </div>
              )}

              <form onSubmit={handleSubmitPayout} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Payout Amount (₹) * (Min ₹1,000, Max ₹{balance})
                  </label>
                  <input
                    type="number"
                    min="1000"
                    max={balance}
                    step="100"
                    required
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Payout Settlement Method *
                  </label>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                    <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="radio"
                        name="method"
                        checked={payoutMethod === 'UPI'}
                        onChange={() => setPayoutMethod('UPI')}
                      />
                      UPI Virtual Payment Address (VPA)
                    </label>
                    <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="radio"
                        name="method"
                        checked={payoutMethod === 'BANK'}
                        onChange={() => setPayoutMethod('BANK')}
                      />
                      Bank Account & IFSC
                    </label>
                  </div>
                </div>

                {payoutMethod === 'UPI' ? (
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                      Registered UPI ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="username@okhdfcbank"
                      value={payoutUpi}
                      onChange={(e) => setPayoutUpi(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                        Bank Name
                      </label>
                      <input
                        type="text"
                        required
                        value={payoutBank.bankName}
                        onChange={(e) => setPayoutBank({ ...payoutBank, bankName: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                        Account Number
                      </label>
                      <input
                        type="text"
                        required
                        value={payoutBank.accountNumber}
                        onChange={(e) => setPayoutBank({ ...payoutBank, accountNumber: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        required
                        value={payoutBank.ifscCode}
                        onChange={(e) => setPayoutBank({ ...payoutBank, ifscCode: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsPayoutModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" disabled={payoutSubmitting}>
                    {payoutSubmitting ? 'Submitting...' : `Submit Request for ₹${payoutAmount.toLocaleString()}`}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
