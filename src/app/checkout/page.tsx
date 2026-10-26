'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import { HoldCountdownTimer } from '../../components/booking/HoldCountdownTimer';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const slotId = searchParams.get('slotId') || 'slot-d111-0-10-1';
  const doctorId = searchParams.get('doctorId') || 'd1111111-1111-1111-1111-111111111111';
  const expiresAt = searchParams.get('expiresAt') || new Date(Date.now() + 600000).toISOString();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NETBANKING' | 'CARD'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<any>(null);

  useEffect(() => {
    async function initCheckout() {
      try {
        const data = await api.createCheckout(slotId);
        setCheckoutData(data);
      } catch (err) {
        // Fallback checkout details
        setCheckoutData({
          orderId: `order_${Date.now()}`,
          slotId,
          doctorName: 'Dr. Vaidya Rajesh Sharma',
          specialty: 'Kayachikitsa (Internal Medicine)',
          amount: 650,
          currency: 'INR',
          holdExpiresAt: expiresAt,
        });
      }
    }
    initCheckout();
  }, [slotId, expiresAt]);

  const handleConfirmAndPay = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const orderId = checkoutData?.orderId || `order_${Date.now()}`;
      const result = await api.processPayment(orderId, paymentMethod);

      // Redirect to consultation room or confirmation
      const consultationId = result.consultation?.id || 'c1111111-1111-1111-1111-111111111111';
      router.push(`/consultation/${consultationId}`);
    } catch (err) {
      setErrorMessage((err as Error).message || 'Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-surface-raised)', minHeight: '100vh', padding: 'var(--space-11) 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <nav style={{ marginBottom: 'var(--space-8)', fontSize: '14px' }}>
          <Link href={`/doctors/${doctorId}`} style={{ color: 'var(--color-border-muted)' }}>
            ← Back to Slot Selection
          </Link>
        </nav>

        {/* Hold Countdown Timer */}
        <div style={{ marginBottom: 'var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '28px', color: 'var(--color-text-primary)' }}>
            Checkout & Confirmation
          </h1>
          <HoldCountdownTimer expiresAt={expiresAt} />
        </div>

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

        {/* Booking Summary Card */}
        <div className="amrutam-card" style={{ padding: 'var(--space-10)', marginBottom: 'var(--space-8)' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Consultation Details</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '15px' }}>
            <div>
              <span style={{ color: '#666', fontSize: '12px', display: 'block' }}>Consulting Vaidya</span>
              <strong>{checkoutData?.doctorName || 'Dr. Vaidya Rajesh Sharma'}</strong>
            </div>
            <div>
              <span style={{ color: '#666', fontSize: '12px', display: 'block' }}>Specialty</span>
              <strong>{checkoutData?.specialty || 'Kayachikitsa (Internal Medicine)'}</strong>
            </div>
            <div>
              <span style={{ color: '#666', fontSize: '12px', display: 'block' }}>Format</span>
              <span>1-on-1 Encrypted Telehealth Video</span>
            </div>
            <div>
              <span style={{ color: '#666', fontSize: '12px', display: 'block' }}>Session Duration</span>
              <span>30 Minutes Full Clinical Evaluation</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="amrutam-card" style={{ padding: 'var(--space-10)', marginBottom: 'var(--space-8)' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Select Payment Method</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: 'UPI', label: 'UPI (Google Pay, PhonePe, Paytm, BHIM)', badge: 'Instant & Zero Surcharge' },
              { id: 'NETBANKING', label: 'Net Banking (All Major Indian Banks)', badge: 'Secure Gateway' },
              { id: 'CARD', label: 'Credit / Debit Card (Visa, MasterCard, RuPay)', badge: '256-bit Encrypted' },
            ].map((method) => {
              const isSelected = paymentMethod === method.id;
              return (
                <label
                  key={method.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-xs)',
                    border: isSelected ? '2px solid var(--color-border-muted)' : '1px solid rgba(58, 100, 59, 0.25)',
                    backgroundColor: isSelected ? 'var(--color-surface-muted)' : 'var(--color-surface-raised)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={isSelected}
                      onChange={() => setPaymentMethod(method.id as any)}
                      style={{ accentColor: 'var(--color-border-muted)' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '15px' }}>{method.label}</span>
                  </div>
                  <Badge variant="neutral">{method.badge}</Badge>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Breakdown & Action */}
        <div
          className="amrutam-card"
          style={{
            padding: 'var(--space-10)',
            backgroundColor: 'var(--color-surface-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '13px', color: '#666' }}>Total Payable Amount</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              ₹{checkoutData?.amount || 650}
            </div>
            <span style={{ fontSize: '12px', color: '#556b2f' }}>Includes all applicable healthcare taxes</span>
          </div>

          <Button
            size="lg"
            variant="primary"
            isLoading={isProcessing}
            onClick={handleConfirmAndPay}
          >
            Confirm & Complete Consultation Booking →
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
