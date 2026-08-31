'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { 
  ShieldCheck, 
  UploadCloud, 
  FileText, 
  Layers, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Lock,
  Cpu,
  GraduationCap
} from 'lucide-react';

export default function LandingPage() {
  const { user, quickLoginDemo } = useAuth();

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-surface-border bg-gradient-to-b from-white via-background to-surface-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Student & Project Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-academic-50 border border-academic-200 text-xs text-academic-900 shadow-subtle">
              <GraduationCap className="w-4 h-4 text-academic-700" />
              <span className="font-semibold">B.Tech CSE Final Project</span>
              <span className="text-academic-400">•</span>
              <span>Tathagata Chakraborty (UG/SOET/30/24/144)</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
              Academic-Grade Plagiarism <br />
              <span className="text-academic-700 italic font-normal">Detection & Analysis</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
              Empowering scholarly integrity with a deterministic similarity engine combining N-gram shingling, TF-IDF cosine vectorization, and exact passage mapping.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              {user ? (
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-academic-800 hover:bg-academic-900 text-white font-medium text-sm flex items-center justify-center space-x-2 shadow-card transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Enter {user.role === 'admin' ? 'Admin Center' : 'Student Dashboard'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-academic-800 hover:bg-academic-900 text-white font-medium text-sm flex items-center justify-center space-x-2 shadow-card transition-all"
                  >
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <Link
                    href="/register"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-medium text-sm flex items-center justify-center space-x-2 shadow-subtle transition-all"
                  >
                    <span>Register Student Account</span>
                  </Link>
                </>
              )}
            </div>

            {/* Quick Demo Access Bar */}
            <div className="pt-4 flex items-center justify-center space-x-3 text-xs text-slate-600">
              <span className="font-medium">Instant One-Click Demo:</span>
              <button
                onClick={() => quickLoginDemo('student')}
                className="text-academic-700 hover:text-academic-900 font-semibold underline underline-offset-2"
              >
                Log in as Student (Tathagata)
              </button>
              <span>•</span>
              <button
                onClick={() => quickLoginDemo('admin')}
                className="text-academic-700 hover:text-academic-900 font-semibold underline underline-offset-2"
              >
                Log in as Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Workflow Section */}
      <section className="py-16 bg-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              End-to-End Verification Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              From raw document upload to interactive passage-level evidence reporting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-xl bg-surface-subtle border border-surface-border space-y-3 relative group hover:border-academic-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-academic-100 text-academic-800 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-semibold text-sm text-slate-900">Document Extraction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Native parsing for PDF, DOCX, and TXT buffers preserving sentence integrity and character offsets.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl bg-surface-subtle border border-surface-border space-y-3 relative group hover:border-academic-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-academic-100 text-academic-800 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-semibold text-sm text-slate-900">Mathematical Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                N-gram token shingling, TF-IDF vector space projection, and cosine similarity comparison across active corpus.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl bg-surface-subtle border border-surface-border space-y-3 relative group hover:border-academic-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-academic-100 text-academic-800 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-semibold text-sm text-slate-900">Passage Offset Mapping</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identifies matched sentence segments, pinpointing exact character offsets and source citations.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-xl bg-surface-subtle border border-surface-border space-y-3 relative group hover:border-academic-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-academic-100 text-academic-800 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="font-semibold text-sm text-slate-900">Interactive Report</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Color-coded interactive document viewer, side-by-side snippet comparisons, and printable clearance certificates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Similarity Thresholds & Risk Breakdown */}
      <section className="py-16 bg-surface-subtle border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Academic Risk Categories & Scoring
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Configurable compliance thresholds tailored for university assignments and thesis evaluations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Low Risk */}
            <div className="p-5 rounded-xl bg-white border border-emerald-200 shadow-subtle space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  0% – 15%
                </span>
                <span className="text-xs font-semibold text-emerald-700">Low Risk</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Acceptable scholarly originality. Standard citations and common academic terminologies.
              </p>
            </div>

            {/* Moderate Risk */}
            <div className="p-5 rounded-xl bg-white border border-amber-200 shadow-subtle space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  16% – 30%
                </span>
                <span className="text-xs font-semibold text-amber-700">Moderate</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Minor overlapping passages detected. Review citations and paraphrasing before final submission.
              </p>
            </div>

            {/* High Risk */}
            <div className="p-5 rounded-xl bg-white border border-orange-200 shadow-subtle space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
                  31% – 50%
                </span>
                <span className="text-xs font-semibold text-orange-700">High Risk</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Significant passage borrowing and verbatim structures. Requires thorough academic revision.
              </p>
            </div>

            {/* Very High Risk */}
            <div className="p-5 rounded-xl bg-white border border-red-200 shadow-subtle space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                  &gt; 50%
                </span>
                <span className="text-xs font-semibold text-red-700">Critical</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Severe plagiarism detected across multiple sources. Violates academic integrity standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Integrity CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-academic-800 text-white flex items-center justify-center mx-auto shadow-subtle">
            <ShieldCheck className="w-7 h-7 text-blue-200" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-slate-900">
            Ready to verify your academic document?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Upload your paper in PDF, DOCX, or plain text format to generate a comprehensive similarity breakdown within seconds.
          </p>
          <div className="pt-2">
            <Link
              href="/upload"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-academic-700 hover:bg-academic-800 text-white font-medium text-sm shadow-card transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document Now</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
