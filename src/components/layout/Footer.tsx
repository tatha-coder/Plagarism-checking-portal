import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4 text-slate-100" />
            </div>
            <span className="font-semibold text-sm text-slate-900">
              PlagiarismCheck
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-600 font-medium">
            <Link href="/home" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/upload" className="hover:text-slate-900 transition-colors">
              Check Document
            </Link>
            <Link href="/history" className="hover:text-slate-900 transition-colors">
              Submissions
            </Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">
              Student Sign In
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            &copy; 2026 PlagiarismCheck. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
