'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../lib/auth-context';

export default function DoctorRegistrationPage() {
  const { setUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submittedDoctor, setSubmittedDoctor] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    qualification: 'BAMS, MD (Ayurveda)',
    primarySpecialty: 'Kayachikitsa (Internal Medicine)',
    experienceYears: 5,
    consultationFee: 500,
    bio: '',
    licenseDocumentUrl: 'https://cdn.amrutam.co.in/docs/sample_medical_license.pdf',
    qualificationDocumentUrl: 'https://cdn.amrutam.co.in/docs/sample_degree_certificate.pdf',
    idProofUrl: 'https://cdn.amrutam.co.in/docs/sample_doctor_id.pdf',
  });

  const [uploadedFiles, setUploadedFiles] = useState<{
    license: string | null;
    degree: string | null;
    idProof: string | null;
  }>({
    license: 'medical_license_ayush_2024.pdf',
    degree: 'bams_md_degree_certificate.pdf',
    idProof: 'aadhaar_verification_card.pdf',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const doc = await api.createDoctor({
        fullName: formData.fullName,
        email: formData.email,
        licenseNumber: formData.licenseNumber,
        qualification: formData.qualification,
        primarySpecialty: formData.primarySpecialty,
        experienceYears: Number(formData.experienceYears),
        consultationFee: Number(formData.consultationFee),
        bio: formData.bio,
        licenseDocumentUrl: formData.licenseDocumentUrl,
        qualificationDocumentUrl: formData.qualificationDocumentUrl,
        idProofUrl: formData.idProofUrl,
        isAdminCreated: false,
      });

      setSubmittedDoctor(doc);

      // Update current user session to this pending doctor
      setUser({
        id: doc.userId,
        doctorId: doc.id,
        role: 'DOCTOR',
        fullName: doc.fullName,
        email: doc.email,
        phone: formData.phone,
        verificationStatus: 'PENDING_VERIFICATION',
      });
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to submit registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-surface-raised)', minHeight: '100vh', padding: 'var(--space-10) 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--color-border-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-primary-dark)', textDecoration: 'none' }}>Home</Link>
          {' '}/ <Link href="/doctor" style={{ color: 'var(--color-primary-dark)', textDecoration: 'none' }}>Doctor Portal</Link>
          {' '}/ Practitioner Onboarding & Verification
        </div>

        {submittedDoctor ? (
          <div
            className="amrutam-card"
            style={{
              padding: '36px',
              backgroundColor: '#fffdf3',
              border: '2px solid #3a643b',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontSize: '28px',
              }}
            >
              ✓
            </div>

            <h1 style={{ fontSize: '24px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              Registration & KYC Documents Submitted!
            </h1>

            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 24px auto' }}>
              Thank you, <strong>{submittedDoctor.fullName}</strong>. Your medical credentials, license (<strong>{submittedDoctor.licenseNumber}</strong>), and uploaded certificates have been routed to the <strong>Amrutam Clinical Governance Admin</strong> for KYC verification.
            </p>

            <div
              style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                padding: '16px',
                borderRadius: '6px',
                maxWidth: '560px',
                margin: '0 auto 28px auto',
                textAlign: 'left',
                fontSize: '13px',
                color: '#92400e',
              }}
            >
              <strong>Status: PENDING_VERIFICATION</strong>
              <p style={{ margin: '6px 0 0 0', lineHeight: 1.5 }}>
                In accordance with Telemedicine Practice Guidelines & AYUSH regulations, slot availability and patient appointments remain locked until administrative approval is granted.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <Link
                href="/doctor"
                style={{
                  backgroundColor: 'var(--color-primary-dark)',
                  color: '#fff',
                  padding: '10px 24px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Go to Doctor Dashboard →
              </Link>

              <Link
                href="/admin"
                style={{
                  border: '1px solid var(--color-primary-dark)',
                  color: 'var(--color-primary-dark)',
                  padding: '10px 24px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Open Admin Approval Center
              </Link>
            </div>
          </div>
        ) : (
          <div className="amrutam-card" style={{ padding: '36px', backgroundColor: 'var(--color-surface-raised)' }}>
            <div style={{ borderBottom: '1px solid rgba(58, 100, 59, 0.2)', paddingBottom: '20px', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '26px', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
                Ayurvedic Practitioner Registration & Onboarding
              </h1>
              <p style={{ fontSize: '14px', color: '#556b2f', margin: 0 }}>
                Join the Amrutam clinical network. Upload your state/national AYUSH medical license and qualifications for administrative verification.
              </p>
            </div>

            {errorMessage && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #ef4444',
                  borderRadius: '6px',
                  color: '#991b1b',
                  marginBottom: '20px',
                  fontSize: '14px',
                }}
              >
                ⚠ {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Personal & Contact */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Full Legal Name (with title) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Vaidya Shailesh Dave"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vaidya.dave@amrutam.co.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
              </div>

              {/* Medical Credentials */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    AYUSH / NMC Medical Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AY-NMC-2024-8891"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Highest Clinical Qualifications *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BAMS, MD (Ayurveda - Kayachikitsa)"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
              </div>

              {/* Specialty & Experience */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Primary Clinical Specialty *
                  </label>
                  <select
                    value={formData.primarySpecialty}
                    onChange={(e) => setFormData({ ...formData, primarySpecialty: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="Kayachikitsa (Internal Medicine)">Kayachikitsa (Internal Medicine)</option>
                    <option value="Shalakya Tantra (ENT & Ophthalmology)">Shalakya Tantra (ENT & Eye)</option>
                    <option value="Panchakarma (Detoxification)">Panchakarma (Detoxification)</option>
                    <option value="Prasuti & Stri Roga (Gynecology)">Prasuti & Stri Roga (Gynecology)</option>
                    <option value="Kaumarbhritya (Pediatrics)">Kaumarbhritya (Pediatrics)</option>
                    <option value="Twak Roga (Dermatology)">Twak Roga (Dermatology)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Years of Clinical Experience *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    required
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Consultation Fee (₹) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    step="50"
                    required
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
              </div>

              {/* Clinical Bio */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Practitioner Biography & Clinical Philosophy
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your lineage, diagnostic expertise (Nadi Pariksha), and clinical focus..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              {/* KYC Document Upload Section */}
              <div
                style={{
                  border: '1px dashed #3a643b',
                  backgroundColor: 'var(--color-surface-muted)',
                  borderRadius: '6px',
                  padding: '20px',
                }}
              >
                <h3 style={{ fontSize: '16px', color: 'var(--color-text-primary)', margin: '0 0 6px 0' }}>
                  Upload Verification & Compliance Documents
                </h3>
                <p style={{ fontSize: '13px', color: '#556b2f', margin: '0 0 16px 0' }}>
                  Files will be encrypted and submitted directly to the Clinical Governance Committee for license verification.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  {/* License File */}
                  <div style={{ backgroundColor: '#fff', padding: '14px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>
                      1. Medical License Proof *
                    </span>
                    <div style={{ fontSize: '12px', color: '#065f46', marginBottom: '8px' }}>
                      📄 {uploadedFiles.license || 'No file selected'}
                    </div>
                    <label
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Attach License PDF
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setUploadedFiles({ ...uploadedFiles, license: file.name });
                        }}
                      />
                    </label>
                  </div>

                  {/* Degree Certificate */}
                  <div style={{ backgroundColor: '#fff', padding: '14px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>
                      2. Highest Degree (BAMS/MD) *
                    </span>
                    <div style={{ fontSize: '12px', color: '#065f46', marginBottom: '8px' }}>
                      📄 {uploadedFiles.degree || 'No file selected'}
                    </div>
                    <label
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Attach Degree PDF
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setUploadedFiles({ ...uploadedFiles, degree: file.name });
                        }}
                      />
                    </label>
                  </div>

                  {/* ID Proof */}
                  <div style={{ backgroundColor: '#fff', padding: '14px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>
                      3. Government ID Proof *
                    </span>
                    <div style={{ fontSize: '12px', color: '#065f46', marginBottom: '8px' }}>
                      📄 {uploadedFiles.idProof || 'No file selected'}
                    </div>
                    <label
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Attach ID Proof
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setUploadedFiles({ ...uploadedFiles, idProof: file.name });
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <Link
                  href="/doctor"
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Link>

                <Button variant="primary" size="lg" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting Application...' : 'Submit for Admin Verification'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
