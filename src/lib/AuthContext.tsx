'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SafeUser } from '@/types';

interface AuthContextType {
  user: SafeUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  quickLoginDemo: (role: 'student' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_STUDENT_USER: SafeUser = {
  id: 'usr_student_001',
  name: 'Aarav Sharma',
  email: 'student@portal.edu',
  role: 'student',
  roll_number: '22/CSE/UG/042',
  section: 'CSE-A',
  program: 'B.Tech Computer Science & Engineering',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEFAULT_ADMIN_USER: SafeUser = {
  id: 'usr_admin_001',
  name: 'Prof. Dr. Rajesh Verma',
  email: 'admin@portal.edu',
  role: 'admin',
  roll_number: 'FAC/CSE/2026/01',
  section: 'CSE Department',
  program: 'Faculty / Administration',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(DEFAULT_STUDENT_USER);
  const [loading, setLoading] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          return;
        }
      }
    } catch (err) {
      // fallback already set
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (err: any) {
      return { success: false, error: 'Network or server error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      window.location.href = '/login';
    }
  };

  const quickLoginDemo = async (role: 'student' | 'admin') => {
    const newUser = role === 'student' ? DEFAULT_STUDENT_USER : DEFAULT_ADMIN_USER;
    setUser(newUser);
    try {
      const email = role === 'student' ? 'student@portal.edu' : 'admin@portal.edu';
      const password = role === 'student' ? 'password123' : 'admin123';
      await login(email, password);
    } catch (e) {
      // Ignored
    }
    window.location.href = role === 'student' ? '/dashboard' : '/admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser: fetchCurrentUser,
        quickLoginDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
