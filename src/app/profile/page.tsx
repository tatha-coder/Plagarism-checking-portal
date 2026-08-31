'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
  User, 
  Mail, 
  Hash, 
  Layers, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Save,
  GraduationCap
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    roll_number: '',
    section: '',
    program: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        setFormData({
          name: user.name || '',
          roll_number: user.roll_number || '',
          section: user.section || '',
          program: user.program || '',
        });
      }
    }
  }, [user, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      setIsSubmitting(false);

      if (res.ok) {
        setSuccessMsg('Academic profile updated successfully!');
        await refreshUser();
      } else {
        setErrorMsg(json.error || 'Failed to update profile.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Network error while updating profile.');
    }
  };

  if (authLoading) {
    return null;
  }

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-surface-border pb-6">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-6 h-6 text-academic-700" />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Academic Profile & Credentials
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage your university identification, enrollment credentials, and personal details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="p-6 rounded-2xl bg-white border border-surface-border shadow-card text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-academic-100 border-2 border-academic-300 text-academic-800 flex items-center justify-center font-bold text-2xl mx-auto shadow-subtle">
            {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>

          <div className="space-y-1">
            <h2 className="font-serif font-bold text-lg text-slate-900">{user?.name}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>

          <div className="pt-2 flex flex-col items-center space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-academic-50 text-academic-800 border border-academic-200">
              Role: {user?.role.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-slate-600">
              Roll: {user?.roll_number}
            </span>
          </div>

          <div className="border-t border-slate-100 pt-4 text-left space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-600">Section:</span>
              <span className="font-semibold text-slate-800 font-mono">{user?.section}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Program:</span>
              <span className="font-semibold text-slate-800">{user?.program}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Status:</span>
              <span className="font-semibold text-emerald-600">Enrolled & Active</span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-white border border-surface-border shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-sm text-slate-900 uppercase tracking-wider">
              Edit Candidate Information
            </h3>
            <p className="text-xs text-slate-500">
              Update name, roll number, section, or academic program
            </p>
          </div>

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-academic-500 bg-slate-50/40 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Roll Number
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="roll_number"
                    required
                    value={formData.roll_number}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-academic-500 bg-slate-50/40 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Section
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="section"
                    required
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-academic-500 bg-slate-50/40 text-slate-900 font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Program / Degree
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="program"
                  required
                  value={formData.program}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-academic-500 bg-slate-50/40 text-slate-900"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-academic-800 hover:bg-academic-900 text-white font-semibold text-xs flex items-center space-x-2 shadow-sm transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
