'use client';

import React from 'react';
import { AuthProvider } from '../../lib/auth-context';
import { AuthModal } from './AuthModal';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
      <AuthModal />
    </AuthProvider>
  );
};
