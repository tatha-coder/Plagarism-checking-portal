'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  Search,
  FileCheck,
  Lock
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 text-balance leading-tight">
            Originality and similarity <br className="hidden sm:inline" />
            checking for your papers
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload your assignments, essays, or research documents to get a clear, passage-by-passage similarity report in seconds.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {user ? (
              <Link
                href="/upload"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Check a Document</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm flex items-center justify-center space-x-2 transition-colors shadow-sm"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-sm flex items-center justify-center transition-colors"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl font-bold text-slate-900">
              How it works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Straightforward document comparison built for clarity and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-slate-900">1. Upload your file</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Drop in a PDF, Microsoft Word (.docx), or plain text document. We extract the text cleanly while preserving structure.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-slate-900">2. Instant comparison</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The document is cross-referenced against the academic corpus to detect verbatim phrasing and closely paraphrased sentences.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-slate-900">3. Clear report</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Review matched passages side-by-side with source citations and view your overall similarity percentage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Simplicity Banner */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold">
                Ready to review your document?
              </h3>
              <p className="text-sm text-slate-300 max-w-lg">
                Create an account or sign in with your email to start checking submissions.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href={user ? '/upload' : '/register'}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-medium text-sm transition-colors"
              >
                <span>{user ? 'Upload Document' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
