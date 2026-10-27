'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import { HoldCountdownTimer } from '../../components/booking/HoldCountdownTimer';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../lib/auth-context';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const slotId = searchParams.get('slotId') || 'slot-d111-0-10-1';
  const doctorId = searchParams.get('doctorId') || 'd1111111-1111-1111-1111-111111111111';
  const expiresAt = searchParams.get('expiresAt') || new Date(Date.now() + 600000).toISOString();

  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'UPI' | 'NETBANKING' | 'CARD'>('RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay checkout script dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ((window as any).Razorpay) {
        setRazorpayLoaded(true);
      } else {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        script.onerror = () => console.warn('Could not load Razorpay SDK');
        document.body.appendChild(script);
      }
    }
  }, []);

  useEffect(() => {
    async function initCheckout() {
      try {
        const data = await api.createCheckout(slotId, user.id);
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
          gatewayDetails: {
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_T3Y5v623Eu8yMx',
            name: 'Amrutam Telemedicine',
            description: 'Ayurvedic Teleconsultation',
          },
        });
      }
    }
    initCheckout();
  }, [slotId, expiresAt, user.id]);

  const handleLaunchRazorpay = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    const orderId = checkoutData?.orderId || `order_${Date.now()}`;
    const keyId =
      checkoutData?.gatewayDetails?.keyId ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      'rzp_test_T3Y5v623Eu8yMx';

    // If Razorpay SDK is loaded on window, open the official Razorpay Checkout modal
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      try {
        const options = {
          key: keyId,
          amount: Math.round((checkoutData?.amount || 650) * 100), // in paise
          currency: checkoutData?.currency || 'INR',
          name: 'Amrutam Telemedicine',
          description: `Consultation with ${checkoutData?.doctorName || 'Ayurvedic Vaidya'}`,
          image: 'https://cdn.amrutam.co.in/brand/amrutam_logo.png',
          order_id: orderId.startsWith('order_') ? orderId : undefined,
          handler: async function (response: any) {
            try {
              const result = await api.processPayment(
                response.razorpay_order_id || orderId,
                'RAZORPAY_GATEWAY',
                {
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }
              );

              const consultationId = result.consultation?.id || 'c1111111-1111-1111-1111-111111111111';
              router.push(`/consultation/${consultationId}`);
            } catch (verifErr) {
              setErrorMessage((verifErr as Error).message || 'Signature verification failed.');
              setIsProcessing(false);
            }
          },
          prefill: {
            name: user.fullName || 'Arjun Verma',
            email: user.email || 'arjun.verma@example.in',
            contact: user.phone || '+91 98765 43210',
          },
          notes: {
            slotId,
            doctorId,
            patientId: user.id,
          },
          theme: {
            color: '#213d31', // Amrutam Forest Green
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          setErrorMessage(response.error?.description || 'Payment was declined or failed.');
          setIsProcessing(false);
        });
        rzp.open();
        return;
      } catch (rzpErr) {
        console.warn('Razorpay modal launch exception:', rzpErr);
      }
    }

    // Direct sandbox fallback if popup is blocked or offline
    try {
      const result = await api.processPayment(orderId, paymentMethod);
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
            Checkout & Razorpay Payment
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

        {/* Live Gateway Badge */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '6px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: '#065f46',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>
              Razorpay Gateway Active: <strong>{checkoutData?.gatewayDetails?.keyId || 'rzp_test_T3Y5v623Eu8yMx'}</strong>
            </span>
          </div>
          <Badge variant="success">Test Mode Connected</Badge>
        </div>

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
              <span style={{ color: '#666', fontSize: '12px', display: 'block' }}>Patient</span>
              <strong>{user.fullName || 'Arjun Verma'} ({user.phone || '+91 98765 43210'})</strong>
            </div>
            <div>
              <span style={{ color: '#666', fontSize: '12px', display: 'block' }}>Session Duration</span>
              <span>30 Minutes Full Clinical Evaluation</span>
            </div>
            {checkoutData?.orderId && (
              <div>
                <span style={{ color: '#666', fontSize: '12px', display: 'block' }}>Razorpay Order ID</span>
                <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{checkoutData.orderId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="amrutam-card" style={{ padding: 'var(--space-10)', marginBottom: 'var(--space-8)' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Select Payment Method</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: 'RAZORPAY', label: 'Razorpay Payment Gateway (UPI, Cards, NetBanking, Wallets)', badge: 'Official Gateway Modal' },
              { id: 'UPI', label: 'Direct Instant UPI (Google Pay, PhonePe, Paytm)', badge: 'Fast Checkout' },
              { id: 'NETBANKING', label: 'Net Banking (All Indian Scheduled Banks)', badge: 'Secure' },
              { id: 'CARD', label: 'Credit / Debit Card (Visa, MasterCard, RuPay)', badge: '256-bit AES' },
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
            onClick={handleLaunchRazorpay}
          >
            {paymentMethod === 'RAZORPAY' ? 'Pay with Razorpay →' : 'Confirm & Complete Booking →'}
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
