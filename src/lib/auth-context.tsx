'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';

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
    email: 'patient.arjun@gmail.com',
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
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  authModalInitialRole: Role;
  openAuthModal: (mode?: 'login' | 'signup', initialRole?: Role) => void;
  closeAuthModal: () => void;
  loginUser: (email: string, password?: string) => Promise<UserPersona>;
  signupUser: (data: any) => Promise<UserPersona>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: PRESET_PERSONAS.patient,
  currentPersonaKey: 'patient',
  switchPersona: () => {},
  setUser: () => {},
  isAuthenticated: true,
  isAuthModalOpen: false,
  authModalMode: 'login',
  authModalInitialRole: 'PATIENT',
  openAuthModal: () => {},
  closeAuthModal: () => {},
  loginUser: async () => PRESET_PERSONAS.patient,
  signupUser: async () => PRESET_PERSONAS.patient,
  logoutUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPersonaKey, setCurrentPersonaKey] = useState<string>('patient');
  const [user, setUser] = useState<UserPersona>(PRESET_PERSONAS.patient);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authModalInitialRole, setAuthModalInitialRole] = useState<Role>('PATIENT');

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('amrutam_auth_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        return;
      }
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
      const chosen = PRESET_PERSONAS[key];
      setUser(chosen);
      try {
        localStorage.setItem('amrutam_active_persona', key);
        localStorage.setItem('amrutam_auth_user', JSON.stringify(chosen));
      } catch {
        // Ignored
      }
    }
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login', initialRole: Role = 'PATIENT') => {
    setAuthModalMode(mode);
    setAuthModalInitialRole(initialRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginUser = async (email: string, password = 'Amrutam@2026'): Promise<UserPersona> => {
    const res = await api.login(email, password);
    const loggedUser: UserPersona = {
      id: res.user.id,
      email: res.user.email,
      role: res.user.role,
      fullName: res.user.fullName,
      phone: res.user.phone,
      prakritiType: res.user.prakritiType,
      doctorId: res.user.doctorId,
      verificationStatus: res.user.verificationStatus,
    };
    setUser(loggedUser);
    try {
      localStorage.setItem('amrutam_auth_user', JSON.stringify(loggedUser));
      if (res.token) localStorage.setItem('amrutam_auth_token', res.token);
    } catch {
      // Ignored
    }
    return loggedUser;
  };

  const signupUser = async (data: any): Promise<UserPersona> => {
    const res = await api.register(data);
    const newUser: UserPersona = {
      id: res.user.id,
      email: res.user.email,
      role: res.user.role,
      fullName: res.user.fullName,
      phone: res.user.phone,
      prakritiType: res.user.prakritiType,
      doctorId: res.user.doctorId,
      verificationStatus: res.user.verificationStatus,
    };
    setUser(newUser);
    try {
      localStorage.setItem('amrutam_auth_user', JSON.stringify(newUser));
      if (res.token) localStorage.setItem('amrutam_auth_token', res.token);
    } catch {
      // Ignored
    }
    return newUser;
  };

  const logoutUser = () => {
    try {
      localStorage.removeItem('amrutam_auth_user');
      localStorage.removeItem('amrutam_auth_token');
    } catch {
      // Ignored
    }
    setUser(PRESET_PERSONAS.patient);
    setCurrentPersonaKey('patient');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentPersonaKey,
        switchPersona,
        setUser,
        isAuthenticated: true,
        isAuthModalOpen,
        authModalMode,
        authModalInitialRole,
        openAuthModal,
        closeAuthModal,
        loginUser,
        signupUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
