import {
  Doctor,
  AvailabilitySlot,
  Consultation,
  Prescription,
  AnalyticsSummary,
  AuditLog,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.detail || errorJson.message || `API error ${res.status}: ${res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`Request to ${url} encountered an error:`, (err as Error).message);
    throw err;
  }
}

export const api = {
  // Doctors
  async getDoctors(params?: { specialty?: string; maxFee?: number; minRating?: number; q?: string }): Promise<Doctor[]> {
    const query = new URLSearchParams();
    if (params?.specialty) query.set('specialty', params.specialty);
    if (params?.maxFee) query.set('maxFee', params.maxFee.toString());
    if (params?.minRating) query.set('minRating', params.minRating.toString());
    if (params?.q) query.set('q', params.q);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request<{ data: Doctor[]; total: number }>(`/doctors${queryString}`);
    return res.data;
  },

  async getDoctorById(id: string): Promise<Doctor> {
    return request<Doctor>(`/doctors/${id}`);
  },

  // Availability & Slots
  async getDoctorSlots(doctorId: string): Promise<AvailabilitySlot[]> {
    const res = await request<{ data: AvailabilitySlot[]; total: number }>(`/availability/${doctorId}`);
    return res.data;
  },

  // Bookings
  async holdSlot(slotId: string, patientId?: string): Promise<{
    slotId: string;
    doctorId: string;
    startTime: string;
    endTime: string;
    status: string;
    holdExpiresAt: string;
    ttlSeconds: number;
    message: string;
  }> {
    return request('/bookings/hold', {
      method: 'POST',
      body: JSON.stringify({ slotId, patientId }),
      headers: {
        'Idempotency-Key': `hold_${slotId}_${Date.now()}`,
      },
    });
  },

  async releaseHold(slotId: string, patientId?: string): Promise<{ success: boolean; message: string }> {
    return request('/bookings/release', {
      method: 'POST',
      body: JSON.stringify({ slotId, patientId }),
    });
  },

  // Payments & Checkout
  async createCheckout(slotId: string, patientId?: string): Promise<{
    orderId: string;
    slotId: string;
    doctorName: string;
    specialty: string;
    startTime: string;
    amount: number;
    currency: string;
    holdExpiresAt: string;
  }> {
    return request('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({ slotId, patientId }),
    });
  },

  async processPayment(orderId: string, paymentMethod = 'UPI'): Promise<{
    success: boolean;
    transactionId: string;
    amount: number;
    currency: string;
    consultation: Consultation;
  }> {
    return request('/payments/process', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentMethod }),
      headers: {
        'Idempotency-Key': `pay_${orderId}_${Date.now()}`,
      },
    });
  },

  // Consultations
  async getConsultations(): Promise<Consultation[]> {
    const res = await request<{ data: Consultation[]; total: number }>('/consultations');
    return res.data;
  },

  async getConsultationById(id: string): Promise<Consultation> {
    return request<Consultation>(`/consultations/${id}`);
  },

  async updateConsultationStatus(id: string, status: Consultation['status']): Promise<Consultation> {
    return request<Consultation>(`/consultations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async saveSoapNotes(id: string, notes: string): Promise<{ id: string; status: string; message: string }> {
    return request(`/consultations/${id}/soap-notes`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },

  // Prescriptions
  async getPrescriptionById(id: string): Promise<Prescription> {
    return request<Prescription>(`/prescriptions/${id}`);
  },

  async getPatientPrescriptions(patientId?: string): Promise<Prescription[]> {
    const query = patientId ? `?patientId=${patientId}` : '';
    const res = await request<{ data: Prescription[]; total: number }>(`/prescriptions${query}`);
    return res.data;
  },

  // Analytics & Governance
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return request<AnalyticsSummary>('/analytics/summary');
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await request<{ data: AuditLog[]; total: number }>('/audit');
    return res.data;
  },

  async verifyAuditChain(): Promise<{
    isValid: boolean;
    totalRecords: number;
    brokenIndex: number | null;
    message: string;
  }> {
    return request('/audit/verify');
  },
};
