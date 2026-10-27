export interface Doctor {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  licenseNumber: string;
  qualification: string;
  primarySpecialty: string;
  secondarySpecialties: string[];
  experienceYears: number;
  bio: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  verificationStatus?: 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  licenseDocumentUrl?: string;
  qualificationDocumentUrl?: string;
  idProofUrl?: string;
}

export interface Patient {
  id: string;
  email: string;
  role: 'PATIENT';
  fullName: string;
  phone: string;
  gender: string;
  prakritiType: string;
  address?: string;
  emergencyContact?: string;
  createdAt?: string;
}

export interface Wallet {
  id: string;
  doctorId: string;
  balance: number;
  totalEarned: number;
  updatedAt: string;
  thresholdInr?: number;
}

export interface PayoutRequest {
  id: string;
  doctorId: string;
  doctorName?: string;
  amount: number;
  status: 'PENDING' | 'PROCESSED' | 'REJECTED';
  accountDetails: {
    upiId?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
  };
  adminNotes?: string;
  createdAt: string;
  processedAt?: string;
}

export interface AvailabilitySlot {
  id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'HELD' | 'BOOKED' | 'BLOCKED';
  heldByPatientId?: string;
  holdExpiresAt?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  slotId?: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  status: 'SCHEDULED' | 'WAITING_ROOM' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  encryptedSoapNotes?: string;
  decryptedSoapNotes?: string | null;
  roomSessionToken: string;
  doctorName?: string;
  specialty?: string;
  patientName?: string;
  doctor?: Partial<Doctor> | null;
  patient?: {
    id: string;
    fullName: string;
    phone?: string;
    prakritiType?: string;
  };
}

export interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  medicineName: string;
  formulation: string;
  dosage: string;
  frequency: string;
  anupana: string;
  durationDays: number;
  specialInstructions?: string;
}

export interface Prescription {
  id: string;
  consultationId: string;
  doctorId: string;
  patientId: string;
  diagnosisNotes: string;
  dietaryAdvice: string;
  lifestyleInstructions: string;
  digitalSignature: string;
  signedAt: string;
  isFinalized: boolean;
  isSignatureValid?: boolean;
  items: PrescriptionItem[];
  doctor?: Partial<Doctor> | null;
  doctorName?: string;
  licenseNumber?: string;
  patient?: {
    id: string;
    fullName: string;
    prakritiType?: string;
  };
}

export interface AnalyticsSummary {
  kpis: {
    totalConsultations: number;
    completedConsultations: number;
    scheduledConsultations: number;
    activeConsultations: number;
    cancelledConsultations: number;
    fulfillmentRatePercent: number;
    estimatedRevenueInr: number;
    activeHolds: number;
    availableSlotsInventory: number;
    totalPatients?: number;
    totalDoctors?: number;
    verifiedDoctors?: number;
    pendingDoctors?: number;
    totalPayoutsProcessedInr?: number;
    pendingPayoutRequestsCount?: number;
    pendingPayoutAmountInr?: number;
  };
  doctorUtilization: Array<{
    doctorId: string;
    doctorName: string;
    specialty: string;
    totalSlots: number;
    bookedSlots: number;
    utilizationRate: number;
    rating: number;
  }>;
  scaleMetrics: {
    targetDailyCapacity: number;
    p95ReadLatencyMs: string;
    p95WriteLatencyMs: string;
    availabilityTarget: string;
    zeroDoubleBookingProtection: string;
  };
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  previousHash: string;
  recordHash: string;
  createdAt: string;
}
