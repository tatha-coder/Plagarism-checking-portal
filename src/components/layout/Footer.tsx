import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-100">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-md bg-slate-950 text-white flex items-center justify-center font-mono font-bold text-[10px]">
                #AP
              </div>
              <span className="font-bold text-sm tracking-tight text-slate-900">
                AcademicPortal
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              High-precision academic similarity inspection platform. Employs multi-layer n-gram shingling and token vector comparison to identify source overlap and citation opportunities before committee evaluation.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-mono font-medium border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                INDEX NODE ONLINE • PRIVACY SEAL ACTIVE
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Inspection Workflow
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li>
                <Link href="/upload" className="hover:text-slate-950 transition-colors">
                  Submit Document (.pdf, .docx)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-950 transition-colors">
                  Workbench Dashboard
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-slate-950 transition-colors">
                  Verification Records & Audit
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Integrity & Standards
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li className="hover:text-slate-950 cursor-pointer">
                Non-Indexing Guarantee
              </li>
              <li className="hover:text-slate-950 cursor-pointer">
                IEEE & APA Attribution Rules
              </li>
              <li className="hover:text-slate-950 cursor-pointer">
                Faculty Certificate Verifier
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="font-mono text-[11px]">
            &copy; {new Date().getFullYear()} AcademicPortal Engine. All rights reserved. Zero-data leakage architecture.
          </p>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span>SHA-256 Verified</span>
            <span>•</span>
            <span>256-bit Document Encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
