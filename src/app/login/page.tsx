'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLoginDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const handleDemoSelect = (role: 'student' | 'admin') => {
    quickLoginDemo(role);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-subtle">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-academic-800 text-white flex items-center justify-center mx-auto shadow-subtle">
            <ShieldCheck className="w-7 h-7 text-blue-200" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Sign In to Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Access your plagiarism reports, submission history, and analysis tools
          </p>
        </div>

        {/* Demo Fast-Login Box */}
        <div className="p-4 rounded-xl bg-academic-50/80 border border-academic-200 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-academic-900">
            <Sparkles className="w-4 h-4 text-academic-600" />
            <span>Instant Demo Accounts (One-Click Login)</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoSelect('student')}
              className="p-2.5 rounded-lg bg-white border border-academic-200 hover:border-academic-400 text-left transition-all shadow-subtle hover:bg-academic-50/50"
            >
              <div className="text-xs font-bold text-slate-900">Student Account</div>
              <div className="text-[10px] text-slate-700 font-mono mt-0.5">Tathagata Chakraborty</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect('admin')}
              className="p-2.5 rounded-lg bg-white border border-academic-200 hover:border-academic-400 text-left transition-all shadow-subtle hover:bg-academic-50/50"
            >
              <div className="text-xs font-bold text-slate-900">Admin Account</div>
              <div className="text-[10px] text-slate-700 font-mono mt-0.5">System Administrator</div>
            </button>
          </div>
        </div>

        {/* Main Login Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-card space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@portal.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent bg-slate-50/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent bg-slate-50/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-academic-800 hover:bg-academic-900 text-white font-medium text-sm flex items-center justify-center space-x-2 shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-600">
              Don't have an account yet?{' '}
              <Link href="/register" className="font-semibold text-academic-700 hover:text-academic-900">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
