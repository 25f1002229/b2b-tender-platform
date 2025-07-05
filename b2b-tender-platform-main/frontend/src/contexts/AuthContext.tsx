'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as authLogin, register as authRegister } from '@/services/authService';

interface UserType {
  id: number;
  email: string;
  company: any;
}

interface AuthContextType {
  user: UserType | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, companyName: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch {
      setUser(null);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const { token, user: userData } = await authLogin(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (err: any) {
      // For fetch-based services, err.status is custom; for axios, err.response.status
      const status = err?.status || err?.response?.status;
      const message = err?.message || '';
      if (status === 401 || message === 'Invalid credentials') {
        setError('Invalid credentials');
      } else {
        setError(message || 'Invalid credentials');
      }
      setUser(null);
    }
    setIsLoading(false);
  };

  const register = async (email: string, password: string, companyName: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const { token, user: userData } = await authRegister(email, password, companyName);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
      setUser(null);
    }
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
