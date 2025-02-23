// src/context/AuthProvider.tsx
'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LoginCredentials, User, AuthResponse } from '@/types/auth.types';
import authService from '@/services/auth.services';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

const initialState: AuthContextType = {
  user: null,
  loading: false,
  error: null,
  login: async () => null,
  logout: () => {},
  isAuthenticated: false
};

const AuthContext = createContext<AuthContextType>(initialState);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando login con:', credentials);
      const response = await authService.login(credentials);
      console.log('Respuesta de login:', response);
      
      if (response && response.token) {
        const userData: User = {
          username: response.usuario,
          esAdmin: response.esAdmin
        };
        
        setUser(userData);
        return response;
      }
      
      throw new Error('Respuesta inválida del servidor');
    } catch (err: any) {
      console.error('Error en login:', err);
      setError(err.message || 'Error al iniciar sesión');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};