import {
  Doctor,
  AvailabilitySlot,
  Consultation,
  Prescription,
  AnalyticsSummary,
  AuditLog,
  Wallet,
  PayoutRequest,
  Patient,
} from '../types';

const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').trim().replace(/\/+$/, '');
const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE_URL}${cleanPath}`;
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
  // Authentication
  async register(data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: 'PATIENT' | 'DOCTOR';
    prakritiType?: string;
  }): Promise<{ user: any; token: string }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(email: string, password?: string): Promise<{ user?: any; token?: string; mfaRequired?: boolean; mfaTempToken?: string }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Doctors
  async getDoctors(params?: {
    specialty?: string;
    maxFee?: number;
    minRating?: number;
    q?: string;
    status?: 'VERIFIED' | 'PENDING_VERIFICATION' | 'REJECTED' | 'ALL';
  }): Promise<Doctor[]> {
    const query = new URLSearchParams();
    if (params?.specialty) query.set('specialty', params.specialty);
    if (params?.maxFee) query.set('maxFee', params.maxFee.toString());
    if (params?.minRating) query.set('minRating', params.minRating.toString());
    if (params?.q) query.set('q', params.q);
    if (params?.status) query.set('status', params.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request<{ data: Doctor[]; total: number }>(`/doctors${queryString}`);
    return res.data;
  },

  async getDoctorById(id: string): Promise<Doctor> {
    return request<Doctor>(`/doctors/${id}`);
  },

  async createDoctor(data: {
    fullName: string;
    email: string;
    licenseNumber: string;
    qualification: string;
    primarySpecialty: string;
    secondarySpecialties?: string[];
    experienceYears: number;
    bio?: string;
    consultationFee?: number;
    licenseDocumentUrl?: string;
    qualificationDocumentUrl?: string;
    idProofUrl?: string;
    isAdminCreated?: boolean;
  }): Promise<Doctor> {
    return request<Doctor>('/doctors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async verifyDoctor(
    doctorId: string,
    status: 'VERIFIED' | 'REJECTED',
    rejectionReason?: string
  ): Promise<Doctor> {
    return request<Doctor>(`/doctors/${doctorId}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ status, rejectionReason }),
    });
  },

  async updateDoctor(doctorId: string, data: Partial<Doctor>): Promise<Doctor> {
    return request<Doctor>(`/doctors/${doctorId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteDoctor(doctorId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/doctors/${doctorId}`, {
      method: 'DELETE',
    });
  },

  // Availability & Slots
  async getDoctorSlots(doctorId: string): Promise<AvailabilitySlot[]> {
    const res = await request<{ data: AvailabilitySlot[]; total: number }>(`/availability/${doctorId}`);
    return res.data;
  },

  async generateDoctorSlots(doctorId: string, daysAhead = 14): Promise<{ count: number; slots: AvailabilitySlot[] }> {
    return request<{ count: number; slots: AvailabilitySlot[] }>(`/availability/${doctorId}/generate`, {
      method: 'POST',
      body: JSON.stringify({ daysAhead }),
    });
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
    gatewayDetails?: {
      keyId: string;
      name: string;
      description: string;
    };
  }> {
    return request('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({ slotId, patientId }),
    });
  },

  async processPayment(
    orderId: string,
    paymentMethod = 'UPI',
    options?: {
      razorpayPaymentId?: string;
      razorpaySignature?: string;
    }
  ): Promise<{
    success: boolean;
    transactionId: string;
    amount: number;
    currency: string;
    consultation: Consultation;
  }> {
    return request('/payments/process', {
      method: 'POST',
      body: JSON.stringify({
        orderId,
        paymentMethod,
        razorpayPaymentId: options?.razorpayPaymentId,
        razorpaySignature: options?.razorpaySignature,
      }),
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

  // Doctor Remuneration Wallet & Payouts (₹200/consultation, ₹1,000 threshold)
  async getDoctorWallet(doctorId: string): Promise<Wallet> {
    return request<Wallet>(`/payouts/wallet?doctorId=${doctorId}`);
  },

  async requestPayout(
    doctorId: string,
    amount: number,
    accountDetails: {
      upiId?: string;
      bankName?: string;
      accountNumber?: string;
      ifscCode?: string;
      accountHolderName?: string;
    }
  ): Promise<PayoutRequest> {
    return request<PayoutRequest>('/payouts/request', {
      method: 'POST',
      body: JSON.stringify({ doctorId, amount, accountDetails }),
    });
  },

  async getDoctorPayoutHistory(doctorId: string): Promise<PayoutRequest[]> {
    const res = await request<{ data: PayoutRequest[]; total: number }>(`/payouts/history?doctorId=${doctorId}`);
    return res.data;
  },

  async getAllPayoutRequests(status?: string): Promise<PayoutRequest[]> {
    const query = status ? `?status=${status}` : '';
    const res = await request<{ data: PayoutRequest[]; total: number }>(`/payouts${query}`);
    return res.data;
  },

  async processPayout(
    payoutId: string,
    status: 'PROCESSED' | 'REJECTED',
    adminNotes?: string
  ): Promise<PayoutRequest> {
    return request<PayoutRequest>(`/payouts/${payoutId}/process`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes }),
    });
  },

  // Patient Management (CRUD)
  async getPatients(): Promise<Patient[]> {
    const res = await request<{ data: Patient[]; total: number }>('/patients');
    return res.data;
  },

  async getPatientById(id: string): Promise<Patient> {
    return request<Patient>(`/patients/${id}`);
  },

  async updatePatientProfile(id: string, data: Partial<Patient>): Promise<Patient> {
    return request<Patient>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deletePatient(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/patients/${id}`, {
      method: 'DELETE',
    });
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
