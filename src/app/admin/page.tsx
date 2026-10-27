import React from 'react';
import type { Metadata } from 'next';
import { AdminDashboardClient } from './AdminDashboardClient';
import { AnalyticsSummary, AuditLog, Doctor, Patient, PayoutRequest } from '../../types';

export const metadata: Metadata = {
  title: 'Admin Governance & Operations Center (SSR) — Amrutam Telemedicine',
  description:
    'Server-Side Rendered clinical operations dashboard with real-time analytics, doctor KYC approvals, remuneration payout settlements, and patient/doctor CRUD.',
};

// Force Server-Side Rendering (SSR) on every incoming request
export const dynamic = 'force-dynamic';

const rawUrl = (
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000/api'
).trim().replace(/\/+$/, '');
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

async function fetchServerData<T>(path: string, fallback: T): Promise<T> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  try {
    const res = await fetch(`${API_BASE_URL}${cleanPath}`, {
      cache: 'no-store', // Ensures fresh SSR data on every request
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`SSR request failed for ${path}: ${res.status} ${res.statusText}`);
      return fallback;
    }

    const json = await res.json();
    return (json.data !== undefined ? json.data : json) as T;
  } catch (err) {
    console.warn(`SSR network fetch exception for ${path}:`, (err as Error).message);
    return fallback;
  }
}

export default async function AdminGovernancePage() {
  // Fetch all initial data on the server in parallel
  const [summary, auditLogs, doctors, patients, payoutRequests] = await Promise.all([
    fetchServerData<AnalyticsSummary | null>('/analytics/summary', null),
    fetchServerData<AuditLog[]>('/audit', []),
    fetchServerData<Doctor[]>('/doctors?status=ALL', []),
    fetchServerData<Patient[]>('/patients', []),
    fetchServerData<PayoutRequest[]>('/payouts', []),
  ]);

  return (
    <AdminDashboardClient
      initialSummary={summary}
      initialAuditLogs={auditLogs}
      initialDoctors={doctors}
      initialPatients={patients}
      initialPayoutRequests={payoutRequests}
    />
  );
}
