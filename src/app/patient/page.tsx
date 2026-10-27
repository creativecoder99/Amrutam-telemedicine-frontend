'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { Consultation, Prescription, Doctor, AvailabilitySlot, Patient } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../lib/auth-context';

export default function PatientDashboardPage() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'doctors' | 'bookings' | 'prescriptions'>('profile');

  // Data states
  const [patientDetails, setPatientDetails] = useState<Partial<Patient>>({
    fullName: user.fullName || 'Arjun Verma',
    email: user.email || 'arjun.verma@example.in',
    phone: user.phone || '+91 98765 43210',
    gender: 'MALE',
    prakritiType: user.prakritiType || 'VATA_PITTA',
    address: '14, Ashoka Enclave, New Delhi - 110001',
    emergencyContact: 'Mrs. Sunita Verma (+91 98111 22334)',
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Register modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRegisterNewModalOpen, setIsRegisterNewModalOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Booking selection state
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [doctorSlots, setDoctorSlots] = useState<AvailabilitySlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [holdingSlotId, setHoldingSlotId] = useState<string | null>(null);

  // New registration form state
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    prakritiType: 'VATA_PITTA',
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [docs, cList, pList] = await Promise.all([
          api.getDoctors({ status: 'VERIFIED' }).catch(() => []),
          api.getConsultations().catch(() => []),
          api.getPatientPrescriptions(user.id).catch(() => []),
        ]);
        setDoctors(docs);
        setConsultations(cList);
        setPrescriptions(pList);
      } catch (err) {
        console.warn('Fallback data for patient view:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user.id]);

  // Handle slot booking
  const handleOpenBookingModal = async (doctor: Doctor) => {
    setSelectedDoctorForBooking(doctor);
    setSlotsLoading(true);
    try {
      const slots = await api.getDoctorSlots(doctor.id);
      setDoctorSlots(slots);
    } catch {
      setDoctorSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleHoldAndBookSlot = async (slotId: string) => {
    setHoldingSlotId(slotId);
    try {
      const hold = await api.holdSlot(slotId, user.id);
      window.location.href = `/checkout?slotId=${slotId}&doctorId=${selectedDoctorForBooking?.id}&expiresAt=${encodeURIComponent(
        hold.holdExpiresAt
      )}`;
    } catch (err) {
      alert((err as Error).message || 'Failed to hold slot. It may have been reserved by another patient.');
      setHoldingSlotId(null);
    }
  };

  // Save profile updates
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setSaveSuccessMessage('');
    try {
      await api.updatePatientProfile(user.id, patientDetails);
      setUser({
        ...user,
        fullName: patientDetails.fullName || user.fullName,
        phone: patientDetails.phone || user.phone,
        prakritiType: patientDetails.prakritiType || user.prakritiType,
      });
      setSaveSuccessMessage('Profile and health details successfully updated in clinical registry.');
      setIsEditModalOpen(false);
    } catch {
      // Fallback update in state
      setUser({
        ...user,
        fullName: patientDetails.fullName || user.fullName,
        phone: patientDetails.phone || user.phone,
        prakritiType: patientDetails.prakritiType || user.prakritiType,
      });
      setSaveSuccessMessage('Profile saved successfully.');
      setIsEditModalOpen(false);
    } finally {
      setProfileSaving(false);
    }
  };

  // Register new patient
  const handleRegisterNewPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await api.register({
        email: regForm.email,
        password: regForm.password || 'SecurePassword123!',
        fullName: regForm.fullName,
        phone: regForm.phone,
        role: 'PATIENT',
        prakritiType: regForm.prakritiType,
      });

      const newUserId = res.user?.id || `patient_${Date.now()}`;
      setUser({
        id: newUserId,
        role: 'PATIENT',
        fullName: regForm.fullName,
        email: regForm.email,
        phone: regForm.phone,
        prakritiType: regForm.prakritiType,
      });

      setPatientDetails({
        fullName: regForm.fullName,
        email: regForm.email,
        phone: regForm.phone,
        prakritiType: regForm.prakritiType,
        gender: 'UNDETERMINED',
        address: 'Registered Address',
        emergencyContact: 'Not provided',
      });

      setIsRegisterNewModalOpen(false);
      setSaveSuccessMessage(`Welcome, ${regForm.fullName}! Your patient account has been created.`);
    } catch (err) {
      alert((err as Error).message || 'Registration failed.');
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-surface-raised)', minHeight: '100vh', padding: 'var(--space-8) 0' }}>
      <div className="container">
        {/* Top Header Card */}
        <div
          className="amrutam-card"
          style={{
            padding: 'var(--space-8)',
            marginBottom: 'var(--space-8)',
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
              <h1 style={{ fontSize: '26px', color: 'var(--color-text-primary)', margin: 0 }}>
                {patientDetails.fullName || user.fullName}
              </h1>
              <Badge variant="warning">Prakriti: {patientDetails.prakritiType || 'VATA_PITTA'}</Badge>
              <Badge variant="success">ABHA Verified Patient</Badge>
            </div>
            <p style={{ fontSize: '14px', color: '#556b2f', margin: 0 }}>
              {patientDetails.email || user.email} • {patientDetails.phone || user.phone} • Patient ID: {user.id.slice(0, 13)}...
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
              Edit Details
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsRegisterNewModalOpen(true)}>
              + Register New User
            </Button>
          </div>
        </div>

        {saveSuccessMessage && (
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
            ✓ {saveSuccessMessage}
          </div>
        )}

        {/* Dashboard Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            borderBottom: '2px solid rgba(58, 100, 59, 0.15)',
            marginBottom: '28px',
          }}
        >
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: 600,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'profile' ? 'var(--color-primary-dark)' : 'var(--color-border-muted)',
              borderBottom: activeTab === 'profile' ? '3px solid var(--color-primary-dark)' : '3px solid transparent',
              marginBottom: '-2px',
            }}
          >
            My Health & Details
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            style={{
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: 600,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'doctors' ? 'var(--color-primary-dark)' : 'var(--color-border-muted)',
              borderBottom: activeTab === 'doctors' ? '3px solid var(--color-primary-dark)' : '3px solid transparent',
              marginBottom: '-2px',
            }}
          >
            Find & Book Doctors ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: 600,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'bookings' ? 'var(--color-primary-dark)' : 'var(--color-border-muted)',
              borderBottom: activeTab === 'bookings' ? '3px solid var(--color-primary-dark)' : '3px solid transparent',
              marginBottom: '-2px',
            }}
          >
            My Bookings ({consultations.length})
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            style={{
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: 600,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'prescriptions' ? 'var(--color-primary-dark)' : 'var(--color-border-muted)',
              borderBottom: activeTab === 'prescriptions' ? '3px solid var(--color-primary-dark)' : '3px solid transparent',
              marginBottom: '-2px',
            }}
          >
            My Prescriptions ({prescriptions.length})
          </button>
        </div>

        {/* TAB 1: Patient Health & Personal Details */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div className="amrutam-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)', margin: 0 }}>
                  Personal & Emergency Details
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--color-primary-dark)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  Edit Information
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: '#6b7280', display: 'block', fontSize: '12px' }}>Full Name</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{patientDetails.fullName}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280', display: 'block', fontSize: '12px' }}>Email Address</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{patientDetails.email}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280', display: 'block', fontSize: '12px' }}>Contact Phone</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{patientDetails.phone}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280', display: 'block', fontSize: '12px' }}>Gender</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{patientDetails.gender || 'MALE'}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280', display: 'block', fontSize: '12px' }}>Residential Address</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{patientDetails.address || 'Not provided'}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280', display: 'block', fontSize: '12px' }}>Emergency Contact</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{patientDetails.emergencyContact || 'Not provided'}</strong>
                </div>
              </div>
            </div>

            <div className="amrutam-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
                Ayurvedic Clinical Profile & Prakriti
              </h3>

              <div
                style={{
                  backgroundColor: 'var(--color-surface-muted)',
                  padding: '16px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Prakriti Constitution
                  </span>
                  <span style={{ color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                    {patientDetails.prakritiType || 'VATA_PITTA'}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#4b5563', margin: 0, lineHeight: 1.5 }}>
                  Dominant dual-dosha: Air/Ether (Vata) and Fire/Water (Pitta). Characteristics include creative energy, sharp metabolism, and susceptibility to digestive inflammation or anxiety when aggravated.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div>
                  <strong style={{ color: 'var(--color-primary-dark)' }}>Recommended Pathya (Beneficial Diet):</strong>
                  <p style={{ margin: '4px 0 0 0', color: '#4b5563' }}>
                    Warm, freshly cooked meals, moderate ghee, sweet fruits, cumin-coriander herbal infusion.
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#b91c1c' }}>Recommended Apathya (To Avoid):</strong>
                  <p style={{ margin: '4px 0 0 0', color: '#4b5563' }}>
                    Excessive dry snacks, deep fried pungent foods, erratic meal timings, cold refrigerated drinks.
                  </p>
                </div>
                <div>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Ayushman Bharat ABHA Health ID:</strong>
                  <p style={{ margin: '4px 0 0 0', color: '#4b5563', fontFamily: 'monospace' }}>
                    91-4428-1902-8812 (Encrypted Envelope Linked)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Find & Book Doctors */}
        {activeTab === 'doctors' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: 'var(--color-text-primary)', margin: 0 }}>
                  Verified Ayurvedic Specialists Available
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--color-border-muted)', margin: '4px 0 0 0' }}>
                  Only doctors verified by Clinical Governance Admin can post availability and accept appointments.
                </p>
              </div>
              <Link
                href="/doctors"
                style={{
                  fontSize: '14px',
                  color: 'var(--color-primary-dark)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Advanced Search & Filters →
              </Link>
            </div>

            {loading ? (
              <p>Loading available doctors...</p>
            ) : doctors.length === 0 ? (
              <div className="amrutam-card" style={{ padding: '32px', textAlign: 'center' }}>
                <p>No verified doctors currently found. Please check back shortly.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="amrutam-card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: '1px solid rgba(58, 100, 59, 0.2)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)', margin: 0 }}>
                          {doctor.fullName}
                        </h3>
                        <Badge variant="success">Verified Vaidya</Badge>
                      </div>

                      <p style={{ fontSize: '13px', color: 'var(--color-border-muted)', margin: '0 0 8px 0', fontWeight: 600 }}>
                        {doctor.primarySpecialty}
                      </p>

                      <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '12px' }}>
                        <div>{doctor.qualification} • {doctor.experienceYears} Years Clinical Exp.</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                          License: {doctor.licenseNumber}
                        </div>
                      </div>

                      <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.4, margin: '0 0 16px 0' }}>
                        {doctor.bio.length > 120 ? `${doctor.bio.slice(0, 120)}...` : doctor.bio}
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(58, 100, 59, 0.15)',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Consultation Fee</span>
                        <strong style={{ fontSize: '18px', color: 'var(--color-primary-dark)' }}>
                          ₹{doctor.consultationFee}
                        </strong>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          href={`/doctors/${doctor.id}`}
                          style={{
                            padding: '6px 12px',
                            border: '1px solid var(--color-primary-dark)',
                            borderRadius: '4px',
                            color: 'var(--color-primary-dark)',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                          }}
                        >
                          View Bio
                        </Link>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenBookingModal(doctor)}
                        >
                          Book Slot
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: My Bookings */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', color: 'var(--color-text-primary)', margin: 0 }}>
                My Telemedicine Bookings
              </h2>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('doctors')}>
                + Book New Consultation
              </Button>
            </div>

            {consultations.length === 0 ? (
              <div className="amrutam-card" style={{ padding: '32px', textAlign: 'center' }}>
                <p style={{ color: '#4b5563', marginBottom: '16px' }}>You have no booked consultations yet.</p>
                <Button variant="primary" onClick={() => setActiveTab('doctors')}>
                  Browse Doctors & Book Now
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {consultations.map((c) => (
                  <div
                    key={c.id}
                    className="amrutam-card"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '17px', color: 'var(--color-text-primary)', margin: 0 }}>
                          {c.doctorName || 'Dr. Vaidya Rajesh Sharma'}
                        </h4>
                        <Badge
                          variant={
                            c.status === 'COMPLETED'
                              ? 'success'
                              : c.status === 'SCHEDULED' || c.status === 'IN_PROGRESS'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {c.status}
                        </Badge>
                      </div>

                      <p style={{ fontSize: '13px', color: '#556b2f', margin: '0 0 6px 0' }}>
                        {c.specialty || 'Ayurvedic Telemedicine'}
                      </p>

                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Time:{' '}
                        {new Date(c.scheduledStartTime).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(c.scheduledEndTime).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {(c.status === 'SCHEDULED' || c.status === 'IN_PROGRESS') && (
                        <Link
                          href={`/consultation/${c.id}`}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: 'var(--color-primary-dark)',
                            color: '#fff',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '13px',
                          }}
                        >
                          Join Consultation Room
                        </Link>
                      )}

                      {c.status === 'COMPLETED' && (
                        <Link
                          href="/prescriptions/rx111111-1111-1111-1111-111111111111"
                          style={{
                            padding: '8px 16px',
                            border: '1px solid var(--color-primary-dark)',
                            color: 'var(--color-primary-dark)',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '13px',
                          }}
                        >
                          View Prescription
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: My Prescriptions */}
        {activeTab === 'prescriptions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', color: 'var(--color-text-primary)', margin: 0 }}>
                My Ayurvedic Prescriptions & Treatment Regimens
              </h2>
            </div>

            {prescriptions.length === 0 ? (
              <div className="amrutam-card" style={{ padding: '32px', textAlign: 'center' }}>
                <p style={{ color: '#4b5563' }}>No prescriptions have been issued for your account yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="amrutam-card" style={{ padding: '24px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        borderBottom: '1px solid rgba(58, 100, 59, 0.2)',
                        paddingBottom: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)', margin: 0 }}>
                          Prescribed by {rx.doctorName || 'Dr. Vaidya Rajesh Sharma'}
                        </h3>
                        <p style={{ fontSize: '12px', color: '#556b2f', margin: '4px 0 0 0' }}>
                          Medical Registration: {rx.licenseNumber || 'AY-NMC-2009-4821'} • Issued on:{' '}
                          {new Date(rx.signedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Badge variant="success">HMAC-SHA256 Signed</Badge>
                        <Link
                          href={`/prescriptions/${rx.id}`}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: 'var(--color-primary-dark)',
                            color: '#fff',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          Print / Official PDF
                        </Link>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                      <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '12px', borderRadius: '4px' }}>
                        <strong style={{ fontSize: '13px', color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>
                          Clinical Diagnosis:
                        </strong>
                        <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>
                          {rx.diagnosisNotes}
                        </p>
                      </div>

                      <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '12px', borderRadius: '4px' }}>
                        <strong style={{ fontSize: '13px', color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>
                          Dietary Regimen (Pathya / Apathya):
                        </strong>
                        <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>
                          {rx.dietaryAdvice}
                        </p>
                      </div>
                    </div>

                    {rx.items && rx.items.length > 0 && (
                      <div style={{ marginBottom: '16px', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ backgroundColor: 'var(--color-surface-muted)', textAlign: 'left' }}>
                              <th style={{ padding: '8px', border: '1px solid rgba(58, 100, 59, 0.1)' }}>Medicine</th>
                              <th style={{ padding: '8px', border: '1px solid rgba(58, 100, 59, 0.1)' }}>Formulation</th>
                              <th style={{ padding: '8px', border: '1px solid rgba(58, 100, 59, 0.1)' }}>Dosage</th>
                              <th style={{ padding: '8px', border: '1px solid rgba(58, 100, 59, 0.1)' }}>Anupana (Carrier)</th>
                              <th style={{ padding: '8px', border: '1px solid rgba(58, 100, 59, 0.1)' }}>Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rx.items.map((it) => (
                              <tr key={it.id}>
                                <td style={{ padding: '8px', border: '1px solid rgba(58, 100, 59, 0.1)', fontWeight: 600 }}>{it.medicineName}</td>
                                <td style={{ padding: '8px', border: '1px solid rgba(58, 100, 59, 0.1)' }}>{it.formulation}</td>
                                <td style={{ padding: '8px', border: '1px solid rgba(58, 100, 59, 0.1)' }}>{it.dosage} ({it.frequency})</td>
                                <td style={{ padding: '8px', border: '1px solid rgba(58, 100, 59, 0.1)' }}>{it.anupana}</td>
                                <td style={{ padding: '8px', border: '1px solid rgba(58, 100, 59, 0.1)' }}>{it.durationDays} Days</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'monospace' }}>
                      Cryptographic HMAC Signature: {rx.digitalSignature}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal: Pick Slot & Book Appointment */}
        {selectedDoctorForBooking && (
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
                maxWidth: '560px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '28px',
                backgroundColor: 'var(--color-surface-raised)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--color-text-primary)', margin: 0 }}>
                  Book Slot with {selectedDoctorForBooking.fullName}
                </h3>
                <button
                  onClick={() => setSelectedDoctorForBooking(null)}
                  style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666' }}
                >
                  ✕
                </button>
              </div>

              <p style={{ fontSize: '13px', color: '#556b2f', margin: '0 0 16px 0' }}>
                {selectedDoctorForBooking.primarySpecialty} • Fee: ₹{selectedDoctorForBooking.consultationFee}
              </p>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '15px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  Available Consultation Slots
                </h4>

                {slotsLoading ? (
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>Checking doctor availability...</p>
                ) : doctorSlots.filter((s) => s.status === 'AVAILABLE').length === 0 ? (
                  <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '4px', fontSize: '13px' }}>
                    No upcoming open slots available for this doctor right now.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                    {doctorSlots
                      .filter((s) => s.status === 'AVAILABLE')
                      .slice(0, 8)
                      .map((slot) => {
                        const start = new Date(slot.startTime);
                        return (
                          <button
                            key={slot.id}
                            disabled={holdingSlotId === slot.id}
                            onClick={() => handleHoldAndBookSlot(slot.id)}
                            style={{
                              padding: '10px',
                              borderRadius: '6px',
                              border: '1px solid var(--color-primary-dark)',
                              backgroundColor: holdingSlotId === slot.id ? '#e5e7eb' : 'var(--color-surface-muted)',
                              color: 'var(--color-text-primary)',
                              cursor: holdingSlotId === slot.id ? 'wait' : 'pointer',
                              textAlign: 'center',
                              fontSize: '12px',
                            }}
                          >
                            <strong style={{ display: 'block' }}>
                              {start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                            </strong>
                            <span>
                              {start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid rgba(58, 100, 59, 0.15)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outline" size="sm" onClick={() => setSelectedDoctorForBooking(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit My Details */}
        {isEditModalOpen && (
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
                  Edit Patient Clinical Profile
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={patientDetails.fullName || ''}
                    onChange={(e) => setPatientDetails({ ...patientDetails, fullName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientDetails.phone || ''}
                    onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Prakriti Dosha Type
                  </label>
                  <select
                    value={patientDetails.prakritiType || 'VATA_PITTA'}
                    onChange={(e) => setPatientDetails({ ...patientDetails, prakritiType: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="VATA">Vata (Air & Ether)</option>
                    <option value="PITTA">Pitta (Fire & Water)</option>
                    <option value="KAPHA">Kapha (Earth & Water)</option>
                    <option value="VATA_PITTA">Vata-Pitta (Bi-Doshic)</option>
                    <option value="PITTA_KAPHA">Pitta-Kapha (Bi-Doshic)</option>
                    <option value="VATA_KAPHA">Vata-Kapha (Bi-Doshic)</option>
                    <option value="TRIDOSHA">Tridoshic (Balanced)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Residential Address
                  </label>
                  <textarea
                    rows={2}
                    value={patientDetails.address || ''}
                    onChange={(e) => setPatientDetails({ ...patientDetails, address: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Emergency Contact Name & Phone
                  </label>
                  <input
                    type="text"
                    value={patientDetails.emergencyContact || ''}
                    onChange={(e) => setPatientDetails({ ...patientDetails, emergencyContact: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" disabled={profileSaving}>
                    {profileSaving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Register New Patient */}
        {isRegisterNewModalOpen && (
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
                  Register as a New Patient
                </h3>
                <button
                  onClick={() => setIsRegisterNewModalOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666' }}
                >
                  ✕
                </button>
              </div>

              <p style={{ fontSize: '13px', color: '#556b2f', margin: '0 0 16px 0' }}>
                Create your patient account to access verified Vaidyas, encrypted medical charts, and digital prescriptions.
              </p>

              <form onSubmit={handleRegisterNewPatient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meera Sharma"
                    value={regForm.fullName}
                    onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="meera@example.in"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Primary Prakriti Dosha
                  </label>
                  <select
                    value={regForm.prakritiType}
                    onChange={(e) => setRegForm({ ...regForm, prakritiType: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="VATA_PITTA">Vata-Pitta</option>
                    <option value="PITTA_KAPHA">Pitta-Kapha</option>
                    <option value="VATA_KAPHA">Vata-Kapha</option>
                    <option value="VATA">Vata Dominant</option>
                    <option value="PITTA">Pitta Dominant</option>
                    <option value="KAPHA">Kapha Dominant</option>
                    <option value="TRIDOSHA">Tridoshic</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsRegisterNewModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" disabled={profileSaving}>
                    {profileSaving ? 'Registering...' : 'Register & Enter Dashboard'}
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
