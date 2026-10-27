'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, Role } from '../../lib/auth-context';
import { Button } from '../ui/Button';

export const AuthModal: React.FC = () => {
  const router = useRouter();
  const {
    isAuthModalOpen,
    authModalMode,
    authModalInitialRole,
    closeAuthModal,
    loginUser,
    signupUser,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<Role>('PATIENT');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login Form
  const [loginEmail, setLoginEmail] = useState('patient.arjun@gmail.com');
  const [loginPassword, setLoginPassword] = useState('Amrutam@2026');

  // Signup Form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Amrutam@2026');
  const [prakritiType, setPrakritiType] = useState('VATA_PITTA');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [qualification, setQualification] = useState('BAMS, MD (Ayurveda)');
  const [specialty, setSpecialty] = useState('Kayachikitsa (Internal Medicine)');
  const [experienceYears, setExperienceYears] = useState(5);

  useEffect(() => {
    setMode(authModalMode);
    setRole(authModalInitialRole);
    setErrorMessage('');
  }, [authModalMode, authModalInitialRole, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const loggedUser = await loginUser(loginEmail, loginPassword);
      closeAuthModal();

      // Open the corresponding dashboard
      if (loggedUser.role === 'PATIENT') {
        router.push('/patient');
      } else if (loggedUser.role === 'DOCTOR') {
        router.push('/doctor');
      } else if (loggedUser.role === 'ADMIN') {
        router.push('/admin');
      }
    } catch (err) {
      setErrorMessage((err as Error).message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const newUser = await signupUser({
        fullName,
        email,
        phone,
        password,
        role,
        prakritiType: role === 'PATIENT' ? prakritiType : undefined,
        licenseNumber: role === 'DOCTOR' ? licenseNumber : undefined,
        qualification: role === 'DOCTOR' ? qualification : undefined,
        specialty: role === 'DOCTOR' ? specialty : undefined,
        experienceYears: role === 'DOCTOR' ? Number(experienceYears) : undefined,
      });

      closeAuthModal();

      // Open the corresponding dashboard
      if (newUser.role === 'PATIENT') {
        router.push('/patient');
      } else if (newUser.role === 'DOCTOR') {
        router.push('/doctor');
      } else {
        router.push('/admin');
      }
    } catch (err) {
      setErrorMessage((err as Error).message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickPreset = (presetEmail: string, presetRole: Role) => {
    setLoginEmail(presetEmail);
    setLoginPassword('Amrutam@2026');
    setRole(presetRole);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(21, 39, 31, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        className="amrutam-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '32px',
          backgroundColor: '#fffdf3',
          border: '2px solid #213d31',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/images/logo/logo.jpeg"
              alt="Amrutam Logo"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                objectFit: 'cover',
                border: '1.5px solid #3a643b',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            />
            <div>
              <h2 style={{ fontSize: '20px', color: '#213d31', margin: 0, fontWeight: 700 }}>
                {mode === 'login' ? 'Welcome to Amrutam' : 'Create Your Amrutam Account'}
              </h2>
              <p style={{ fontSize: '12px', color: '#3a643b', margin: '2px 0 0 0' }}>
                {mode === 'login'
                  ? 'Sign in to access your consultations, prescriptions & records.'
                  : 'Join the clinical Ayurvedic telemedicine network.'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Mode Toggle Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(58, 100, 59, 0.12)',
            borderRadius: '6px',
            padding: '4px',
            marginBottom: '20px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: mode === 'login' ? '#213d31' : 'transparent',
              color: mode === 'login' ? '#fffdf3' : '#213d31',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
            }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: mode === 'signup' ? '#213d31' : 'transparent',
              color: mode === 'signup' ? '#fffdf3' : '#213d31',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Create Account
          </button>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#fee2e2',
              border: '1px solid #ef4444',
              borderRadius: '4px',
              color: '#991b1b',
              marginBottom: '16px',
              fontSize: '13px',
            }}
          >
            ⚠ {errorMessage}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Quick Demo Autofill Pills */}
            <div style={{ backgroundColor: '#f5f5ed', padding: '10px 12px', borderRadius: '6px', fontSize: '11px' }}>
              <span style={{ fontWeight: 700, color: '#213d31', display: 'block', marginBottom: '6px' }}>
                Quick Autofill Demo Accounts:
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => fillQuickPreset('patient.arjun@gmail.com', 'PATIENT')}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #3a643b',
                    color: '#213d31',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  👤 Patient (Arjun)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickPreset('dr.rajesh@amrutam.co.in', 'DOCTOR')}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #3a643b',
                    color: '#213d31',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  🩺 Doctor (Dr. Rajesh)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickPreset('admin@amrutam.co.in', 'ADMIN')}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #3a643b',
                    color: '#213d31',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  🛡️ Admin (Governance)
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#213d31', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@example.in"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#213d31', marginBottom: '4px' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={submitting}
              style={{ marginTop: '8px', width: '100%' }}
            >
              {submitting ? 'Authenticating...' : 'Sign In & Open Dashboard →'}
            </Button>
          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Role Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#213d31', marginBottom: '6px' }}>
                I am registering as:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRole('PATIENT')}
                  style={{
                    padding: '10px',
                    borderRadius: '4px',
                    border: role === 'PATIENT' ? '2px solid #213d31' : '1px solid #ccc',
                    backgroundColor: role === 'PATIENT' ? '#f0fdf4' : '#fff',
                    color: '#213d31',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  👤 Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole('DOCTOR')}
                  style={{
                    padding: '10px',
                    borderRadius: '4px',
                    border: role === 'DOCTOR' ? '2px solid #213d31' : '1px solid #ccc',
                    backgroundColor: role === 'DOCTOR' ? '#f0fdf4' : '#fff',
                    color: '#213d31',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  🩺 Doctor / Vaidya
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#213d31', marginBottom: '4px' }}>
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === 'DOCTOR' ? 'Dr. Vaidya...' : 'e.g. Meera Sharma'}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#213d31', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.in"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#213d31', marginBottom: '4px' }}>
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#213d31', marginBottom: '4px' }}>
                Create Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
              />
            </div>

            {role === 'PATIENT' ? (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#213d31', marginBottom: '4px' }}>
                  Primary Prakriti Dosha
                </label>
                <select
                  value={prakritiType}
                  onChange={(e) => setPrakritiType(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
                >
                  <option value="VATA_PITTA">Vata-Pitta (Dual)</option>
                  <option value="PITTA_KAPHA">Pitta-Kapha (Dual)</option>
                  <option value="VATA_KAPHA">Vata-Kapha (Dual)</option>
                  <option value="VATA">Vata Dominant</option>
                  <option value="PITTA">Pitta Dominant</option>
                  <option value="KAPHA">Kapha Dominant</option>
                  <option value="TRIDOSHA">Tridoshic (Balanced)</option>
                </select>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#213d31', marginBottom: '4px' }}>
                      AYUSH License No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="AY-NMC-2024-XXXX"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#213d31', marginBottom: '4px' }}>
                      Clinical Specialty *
                    </label>
                    <select
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}
                    >
                      <option value="Kayachikitsa (Internal Medicine)">Kayachikitsa</option>
                      <option value="Shalakya Tantra (ENT & Eye)">Shalakya Tantra</option>
                      <option value="Panchakarma (Detoxification)">Panchakarma</option>
                      <option value="Prasuti & Stri Roga (Gynecology)">Prasuti & Stri Roga</option>
                      <option value="Twak Roga (Dermatology)">Twak Roga</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #f59e0b',
                    padding: '10px 12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#92400e',
                  }}
                >
                  ℹ Doctor registrations will be queued for Admin KYC verification before slot availability can be published.
                </div>
              </>
            )}

            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={submitting}
              style={{ marginTop: '8px', width: '100%' }}
            >
              {submitting ? 'Registering...' : `Create ${role === 'DOCTOR' ? 'Doctor' : 'Patient'} Account & Open Dashboard →`}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
