'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Doctor } from '../../types';
import { DoctorCard } from '../../components/doctors/DoctorCard';
import { FilterBar } from '../../components/doctors/FilterBar';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [specialty, setSpecialty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxFee, setMaxFee] = useState(1200);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getDoctors({
          specialty: specialty || undefined,
          q: searchQuery || undefined,
          maxFee,
        });
        setDoctors(data);
      } catch (err) {
        // Fallback demo data
        const fallback: Doctor[] = [
          {
            id: 'd1111111-1111-1111-1111-111111111111',
            userId: 'u1',
            fullName: 'Dr. Vaidya Rajesh Sharma',
            email: 'dr.rajesh@amrutam.co.in',
            licenseNumber: 'AY-NMC-2009-4821',
            qualification: 'BAMS, MD (Ayurveda) - Kayachikitsa',
            primarySpecialty: 'Kayachikitsa (Internal Medicine)',
            secondarySpecialties: ['Digestive Disorders', 'Metabolic Syndrome', 'Agni Deepana'],
            experienceYears: 15,
            bio: 'Senior Ayurvedic Physician with 15 years of clinical mastery in gut health, chronic acidity, IBS, and metabolic harmony through classical herbal formulations.',
            consultationFee: 650,
            rating: 4.95,
            reviewCount: 342,
            isVerified: true,
          },
          {
            id: 'd2222222-2222-2222-2222-222222222222',
            userId: 'u2',
            fullName: 'Dr. Vaidya Ananya Deshmukh',
            email: 'dr.ananya@amrutam.co.in',
            licenseNumber: 'AY-CCIM-2012-8812',
            qualification: 'BAMS, MS (Ayurveda) - Shalakya Tantra',
            primarySpecialty: 'Shalakya Tantra (ENT & Eye Care)',
            secondarySpecialties: ['Migraine Management', 'Sinusitis', 'Computer Vision Syndrome'],
            experienceYears: 12,
            bio: 'Renowned practitioner specializing in supra-clavicular disorders, chronic sinusitis, tension migraines, and holistic eye therapies like Netra Tarpana guidance.',
            consultationFee: 750,
            rating: 4.92,
            reviewCount: 218,
            isVerified: true,
          },
          {
            id: 'd3333333-3333-3333-3333-333333333333',
            userId: 'u3',
            fullName: 'Dr. Vaidya Vikramaditya Joshi',
            email: 'dr.vikramaditya@amrutam.co.in',
            licenseNumber: 'AY-NMC-2006-1029',
            qualification: 'BAMS, Fellowship in Panchakarma (Kerala)',
            primarySpecialty: 'Panchakarma (Detoxification)',
            secondarySpecialties: ['Joint Pain & Arthritis', 'Stress & Insomnia', 'Cellular Rejuvenation'],
            experienceYears: 18,
            bio: 'Gold medalist in classical Panchakarma therapy. Guides structured home-based Shamana treatments and post-cleansing Rasayana rejuvenation regimens.',
            consultationFee: 900,
            rating: 4.98,
            reviewCount: 480,
            isVerified: true,
          },
          {
            id: 'd4444444-4444-4444-4444-444444444444',
            userId: 'u4',
            fullName: 'Dr. Vaidya Priya Nair',
            email: 'dr.priya@amrutam.co.in',
            licenseNumber: 'AY-CCIM-2014-6102',
            qualification: 'BAMS, Diploma in Prasuti & Stri Roga',
            primarySpecialty: 'Prasuti & Stri Roga (Women Health)',
            secondarySpecialties: ['PCOS/PCOD Care', 'Hormonal Balance', 'Postpartum Wellness'],
            experienceYears: 10,
            bio: 'Dedicated women health specialist integrating gentle herbs, cycle sync nutrition, and mindfulness for long-term endocrine balance.',
            consultationFee: 600,
            rating: 4.88,
            reviewCount: 195,
            isVerified: true,
          },
        ];

        let filtered = fallback;
        if (specialty) {
          filtered = filtered.filter((d) => d.primarySpecialty.toLowerCase().includes(specialty.toLowerCase()));
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (d) =>
              d.fullName.toLowerCase().includes(q) ||
              d.primarySpecialty.toLowerCase().includes(q) ||
              d.bio.toLowerCase().includes(q)
          );
        }
        filtered = filtered.filter((d) => d.consultationFee <= maxFee);
        setDoctors(filtered);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [specialty, searchQuery, maxFee]);

  return (
    <div style={{ backgroundColor: 'var(--color-surface-raised)', minHeight: '100vh', padding: 'var(--space-11) 0' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
            Find & Consult Verified Ayurvedic Vaidyas
          </h1>
          <p style={{ color: '#445544', fontSize: '16px' }}>
            Browse certified practitioners by clinical specialty, experience, and patient ratings.
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          specialty={specialty}
          onSpecialtyChange={setSpecialty}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          maxFee={maxFee}
          onMaxFeeChange={setMaxFee}
        />

        {/* Doctor Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-primary)' }}>
            Loading verified practitioners...
          </div>
        ) : doctors.length === 0 ? (
          <div className="amrutam-card" style={{ padding: 'var(--space-11)', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '8px' }}>No Practitioners Match Your Filters</h3>
            <p style={{ color: '#666', marginBottom: '16px' }}>
              Try loosening your search terms or expanding your fee range.
            </p>
            <button
              onClick={() => {
                setSpecialty('');
                setSearchQuery('');
                setMaxFee(1200);
              }}
              style={{
                backgroundColor: 'var(--color-text-primary)',
                color: 'var(--color-surface-raised)',
                padding: '8px 20px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-8)',
            }}
          >
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
