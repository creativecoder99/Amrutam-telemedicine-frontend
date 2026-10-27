'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface UserPersona {
  id: string;
  role: Role;
  fullName: string;
  email: string;
  phone?: string;
  prakritiType?: string;
  doctorId?: string;
  verificationStatus?: 'VERIFIED' | 'PENDING_VERIFICATION' | 'REJECTED';
}

export const PRESET_PERSONAS: Record<string, UserPersona> = {
  patient: {
    id: '55555555-5555-5555-5555-555555555555',
    role: 'PATIENT',
    fullName: 'Arjun Verma',
    email: 'arjun.verma@example.in',
    phone: '+91 98765 43210',
    prakritiType: 'VATA_PITTA',
  },
  doctor_verified: {
    id: 'u2222222-2222-2222-2222-222222222222',
    doctorId: 'd1111111-1111-1111-1111-111111111111',
    role: 'DOCTOR',
    fullName: 'Dr. Vaidya Rajesh Sharma',
    email: 'dr.sharma@amrutam.co.in',
    phone: '+91 94123 45678',
    verificationStatus: 'VERIFIED',
  },
  doctor_pending: {
    id: 'u_doc5_pending',
    doctorId: 'doc5_pending_kyc',
    role: 'DOCTOR',
    fullName: 'Dr. Vaidya Kavyanjali Sen',
    email: 'dr.sen@ayushclinic.org',
    phone: '+91 98301 23456',
    verificationStatus: 'PENDING_VERIFICATION',
  },
  admin: {
    id: 'admin-sys-001',
    role: 'ADMIN',
    fullName: 'Amrutam Clinical Governance Admin',
    email: 'admin@amrutam.co.in',
    phone: '+91 11 4050 9999',
  },
};

interface AuthContextType {
  user: UserPersona;
  currentPersonaKey: string;
  switchPersona: (key: string) => void;
  setUser: (user: UserPersona) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: PRESET_PERSONAS.patient,
  currentPersonaKey: 'patient',
  switchPersona: () => {},
  setUser: () => {},
  isAuthenticated: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPersonaKey, setCurrentPersonaKey] = useState<string>('patient');
  const [user, setUser] = useState<UserPersona>(PRESET_PERSONAS.patient);

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem('amrutam_active_persona');
      if (storedKey && PRESET_PERSONAS[storedKey]) {
        setCurrentPersonaKey(storedKey);
        setUser(PRESET_PERSONAS[storedKey]);
      }
    } catch {
      // LocalStorage not available or SSR
    }
  }, []);

  const switchPersona = (key: string) => {
    if (PRESET_PERSONAS[key]) {
      setCurrentPersonaKey(key);
      setUser(PRESET_PERSONAS[key]);
      try {
        localStorage.setItem('amrutam_active_persona', key);
      } catch {
        // Ignored
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentPersonaKey,
        switchPersona,
        setUser,
        isAuthenticated: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
