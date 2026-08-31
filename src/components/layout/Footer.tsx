import React from 'react';
import { ShieldCheck, BookOpen, Lock, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Academic Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-academic-800 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5 text-blue-200" />
              </div>
              <span className="font-serif font-bold text-base text-foreground tracking-tight">
                Academic Plagiarism Portal
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              A high-precision academic similarity verification engine utilizing N-gram shingling, TF-IDF cosine vectorization, and exact passage mapping for scholarly papers and student submissions.
            </p>
            
            {/* Student Attribution Card */}
            <div className="pt-2">
              <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 p-2.5 rounded-lg bg-academic-50 border border-academic-200 text-xs text-academic-900">
                <span className="font-semibold text-slate-900">Student: Tathagata Chakraborty</span>
                <span className="text-academic-400">|</span>
                <span>Roll: <strong className="font-mono">UG/SOET/30/24/144</strong></span>
                <span className="text-academic-400">|</span>
                <span>Sec: <strong className="font-mono">G</strong></span>
                <span className="text-academic-400">|</span>
                <span>Program: <strong>B.Tech CSE</strong></span>
              </div>
            </div>
          </div>

          {/* Col 2: System Specifications */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Engine Specs
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 font-mono">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>N-Gram Tokenizer (N=3)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>TF-IDF Vector Space</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Exact Offset Mapper</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Multi-Format Parsers</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Standards */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Compliance & Security
            </h4>
            <div className="text-xs text-slate-600 space-y-2">
              <div className="flex items-center space-x-2 text-slate-700">
                <Lock className="w-3.5 h-3.5 text-academic-600" />
                <span>Role-Based Access (RLS)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <BookOpen className="w-3.5 h-3.5 text-academic-600" />
                <span>Zero Hallucination Scoring</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <Terminal className="w-3.5 h-3.5 text-academic-600" />
                <span>Deterministic Comparison</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-700">
          <div>
            © 2026 Plagiarism Checking Portal • SOET B.Tech Computer Science & Engineering
          </div>
          <div className="mt-2 sm:mt-0 font-mono text-[11px] text-slate-700">
            System Node: Production Stable
          </div>
        </div>
      </div>
    </footer>
  );
}
