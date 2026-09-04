'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SafeUser } from '@/types';
import { supabase } from './supabase/client';
import { isValidEmail } from './validation';

interface AuthContextType {
  user: SafeUser | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  quickLoginDemo?: (role?: 'student') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_STUDENT_USER: SafeUser = {
  id: 'usr_student_001',
  name: 'Tathagata Chakraborty',
  email: 'student@portal.edu',
  role: 'student',
  roll_number: 'UG/SOET/30/24/144',
  section: 'G',
  program: 'B.Tech Computer Science & Engineering',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

function mapSupabaseUserToSafeUser(sbUser: any): SafeUser {
  const metadata = sbUser.user_metadata || {};
  return {
    id: sbUser.id,
    name: metadata.name || metadata.full_name || sbUser.email?.split('@')[0] || 'User',
    email: sbUser.email || '',
    role: (metadata.role as 'student' | 'admin') || 'student',
    roll_number: metadata.roll_number || '',
    section: metadata.section || '',
    program: metadata.program || '',
    created_at: sbUser.created_at || new Date().toISOString(),
    updated_at: sbUser.updated_at || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      // 1. Try Supabase Auth session
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (sbUser) {
        setUser(mapSupabaseUserToSafeUser(sbUser));
        setLoading(false);
        return;
      }

      // 2. Try internal /api/auth/me fallback
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      // Keep default demo user
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();

    // Listen to Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
      if (session?.user) {
        setUser(mapSupabaseUserToSafeUser(session.user));
      } else if (_event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      if (!isValidEmail(email)) {
        return { success: false, error: 'Please enter a valid email address.' };
      }

      // Supabase Auth sign-up with Name in user_metadata
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim(),
            role: 'student',
          },
        },
      });

      if (error) {
        // Fallback to internal API if Supabase project is not yet reachable/configured
        const fallbackRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackRes.ok && fallbackData.user) {
          setUser(fallbackData.user);
          return { success: true };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(mapSupabaseUserToSafeUser(data.user));
        // Also register in local DB so document uploads associate seamlessly
        try {
          await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          });
        } catch (e) {}

        return { success: true };
      }

      return { success: false, error: 'Registration could not be completed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred during registration.' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      if (!isValidEmail(email)) {
        return { success: false, error: 'Please enter a valid email address.' };
      }

      // 1. Try Supabase Auth sign-in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (!error && data.user) {
        setUser(mapSupabaseUserToSafeUser(data.user));
        return { success: true };
      }

      // 2. Fallback to API route login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const resData = await res.json();
      if (res.ok && resData.user) {
        setUser(resData.user);
        return { success: true };
      }

      return { 
        success: false, 
        error: error?.message || resData.error || 'Invalid email or password.' 
      };
    } catch (err: any) {
      return { success: false, error: 'Network or server error during sign in.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      window.location.href = '/login';
    }
  };

  const quickLoginDemo = async () => {
    setUser(DEFAULT_STUDENT_USER);
    try {
      await login('student@portal.edu', 'password123');
    } catch (e) {}
    window.location.href = '/dashboard';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
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
