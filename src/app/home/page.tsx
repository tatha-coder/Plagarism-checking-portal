'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  BarChart3, 
  ShieldCheck, 
  Layers, 
  Lock, 
  Zap, 
  FileCheck, 
  Fingerprint, 
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Terminal,
  Activity,
  Award
} from 'lucide-react';

interface SampleCase {
  id: string;
  discipline: string;
  paperTitle: string;
  similarityScore: string;
  riskBadge: string;
  riskClass: string;
  matchedCount: number;
  clauses: {
    text: string;
    isMatch: boolean;
    matchId?: number;
  }[];
  sources: {
    id: number;
    title: string;
    venue: string;
    year: string;
    similarity: string;
    citationType: string;
    recommendation: string;
  }[];
}

const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'cs-systems',
    discipline: 'Distributed Systems',
    paperTitle: 'Evaluation of Consensus Liveness in Partitioned Topologies',
    similarityScore: '14.2%',
    riskBadge: 'Compliant Originality',
    riskClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    matchedCount: 2,
    clauses: [
      {
        text: 'State machine replication guarantees that all peer replicas agree on state transitions despite network degradation. ',
        isMatch: false
      },
      {
        text: 'The Raft consensus protocol achieves understandability through explicit leader election, state replication, and safety invariants. ',
        isMatch: true,
        matchId: 1
      },
      {
        text: 'In our experimental testbed across four cloud regions, heartbeat timers were swept between 150ms and 600ms to observe reelection frequency. ',
        isMatch: false
      },
      {
        text: 'Byzantine fault-tolerant configurations retain safety given that no more than one-third of participants act maliciously. ',
        isMatch: true,
        matchId: 2
      },
      {
        text: 'These latency measurements validate that adaptive timeouts reduce split-brain elections under cross-continental WAN jitter.',
        isMatch: false
      }
    ],
    sources: [
      {
        id: 1,
        title: 'In Search of an Understandable Consensus Algorithm',
        venue: 'USENIX Annual Technical Conference (ATC)',
        year: '2014',
        similarity: '89.4% Verbatim Clause',
        citationType: 'Academic Paper',
        recommendation: 'Enclose verbatim clause in quotation marks or paraphrase specific mechanism in authorial voice with formal in-text citation [Ongaro & Ousterhout, 2014].'
      },
      {
        id: 2,
        title: 'Practical Byzantine Fault Tolerance and Proactive Recovery',
        venue: 'ACM Transactions on Computer Systems (TOCS)',
        year: '2002',
        similarity: '76.1% Phrasing Overlap',
        citationType: 'Foundational Theory',
        recommendation: 'Standard definition of classical BFT bound. Add citation to Castro & Liskov (2002) to verify scholarly lineage.'
      }
    ]
  },
  {
    id: 'ml-theory',
    discipline: 'Machine Learning',
    paperTitle: 'Attention Factorization in Ultra-Long Sequence Modeling',
    similarityScore: '8.7%',
    riskBadge: 'High Originality',
    riskClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    matchedCount: 1,
    clauses: [
      {
        text: 'Transformers exhibit quadratic computational complexity with respect to input sequence length due to full pairwise query-key dot products. ',
        isMatch: true,
        matchId: 1
      },
      {
        text: 'We project continuous embeddings into low-rank sparse sub-manifolds prior to multi-head aggregation. ',
        isMatch: false
      },
      {
        text: 'Empirical benchmark runs on synthetic 64k-token sequences illustrate a 4.1x throughput improvement while preserving perplexity scores within 0.04 margin of baseline.',
        isMatch: false
      }
    ],
    sources: [
      {
        id: 1,
        title: 'Attention Is All You Need',
        venue: 'Advances in Neural Information Processing Systems (NeurIPS)',
        year: '2017',
        similarity: '84.0% Standard Phrasing',
        citationType: 'Core Reference',
        recommendation: 'Synthesize standard computational complexity statement or credit Vaswani et al. (2017) directly.'
      }
    ]
  },
  {
    id: 'biomed',
    discipline: 'Cellular Therapeutics',
    paperTitle: 'Kinetic Selectivity of Synthetic Guide RNA in Ex Vivo Cleavage',
    similarityScore: '21.5%',
    riskBadge: 'Review Suggested',
    riskClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    matchedCount: 2,
    clauses: [
      {
        text: 'CRISPR-Cas nucleases facilitate targeted genomic disruption via RNA-guided double-strand break generation. ',
        isMatch: true,
        matchId: 1
      },
      {
        text: 'However, off-target mutagenesis remains a non-trivial hazard for clinical somatic cell therapy protocols. ',
        isMatch: true,
        matchId: 2
      },
      {
        text: 'In this assay, high-fidelity Cas9 variants were exposed to base-mismatched synthetic hairpin substrates across titrated incubation intervals.',
        isMatch: false
      }
    ],
    sources: [
      {
        id: 1,
        title: 'A Programmable Dual-RNA-Guided DNA Endonuclease in Adaptive Bacterial Immunity',
        venue: 'Science Magazine (AAAS)',
        year: '2012',
        similarity: '91.2% Verbatim Line',
        citationType: 'Seminal Publication',
        recommendation: 'Primary mechanism definition. Include full APA/Nature bibliography entry [Jinek et al., 2012].'
      },
      {
        id: 2,
        title: 'High-Throughput Sequencing for Off-Target Cleavage Profiling',
        venue: 'Nature Biotechnology',
        year: '2015',
        similarity: '78.5% Clause Structure',
        citationType: 'Journal Article',
        recommendation: 'Paraphrase off-target risk context or integrate direct quotation citation.'
      }
    ]
  }
];

export default function HomePage() {
  const { user } = useAuth();
  const [selectedCaseId, setSelectedCaseId] = useState<string>('cs-systems');
  const [activeMatchId, setActiveMatchId] = useState<number>(1);

  const activeCase = SAMPLE_CASES.find(c => c.id === selectedCaseId) || SAMPLE_CASES[0];
  const activeSource = activeCase.sources.find(s => s.id === activeMatchId) || activeCase.sources[0];

  return (
    <div className="flex flex-col min-h-full bg-[#fafaf9] text-slate-950">
      
      {/* 1. HERO SECTION: Editorial Clarity & Precise Hierarchy */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200/80 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-grid-subtle opacity-70 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Engine Status Pill */}
          <div className="flex items-center space-x-2.5 mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-medium border border-slate-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              CORE v2.4 • ACADEMIC SIMILARITY KERNEL
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              N-Gram Shingling & Vector Overlap
            </span>
          </div>

          {/* Primary Editorial Display Header */}
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-bold tracking-tight text-slate-950 leading-[1.08]">
              Sentence-level lexical & semantic similarity inspection.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-[65ch] leading-relaxed font-normal">
              Analyze theses, research manuscripts, and assignment drafts against millions of scholarly works. Isolate verbatim phrases, identify paraphrased overlap, and verify citations before committee evaluation.
            </p>
          </div>

          {/* Direct Tactile CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            {user ? (
              <>
                <Link
                  href="/upload"
                  className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-medium text-sm flex items-center justify-center space-x-2.5 shadow-sm hover:shadow transition-all active:scale-[0.98]"
                >
                  <UploadCloud className="w-4 h-4 text-blue-400" />
                  <span>Submit Document for Scan</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-medium text-sm flex items-center justify-center transition-all hover:border-slate-400 active:scale-[0.98]"
                >
                  <span>Open Analysis Workbench</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-medium text-sm flex items-center justify-center space-x-2.5 shadow-sm hover:shadow transition-all active:scale-[0.98]"
                >
                  <span>Start Free Student Check</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-medium text-sm flex items-center justify-center transition-all hover:border-slate-400 active:scale-[0.98]"
                >
                  <span>Access Existing Account</span>
                </Link>
              </>
            )}
            <div className="sm:ml-4 flex items-center space-x-2 text-xs font-mono text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Strictly private • Never indexed into public crawlers</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TECHNICAL TELEMETRY RIBBON: No Cliché Marquee, Clean Telemetry */}
      <section className="py-3.5 bg-slate-950 text-slate-300 border-b border-slate-800 text-xs font-mono select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>ENGINE: <strong className="text-white font-mono">TF-IDF + 3-GRAM SHINGLES</strong></span>
            </span>
            <span className="hidden md:inline text-slate-700">/</span>
            <span className="hidden md:flex items-center space-x-2 text-slate-400">
              <span>JACCARD THRESHOLD: <strong className="text-white font-mono">0.65</strong></span>
            </span>
            <span className="hidden lg:inline text-slate-700">/</span>
            <span className="hidden lg:flex items-center space-x-2 text-slate-400">
              <span>PARSER: <strong className="text-white font-mono">PDF / DOCX / TXT NATIVE</strong></span>
            </span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>ISOLATION: <strong className="text-emerald-400 font-mono">EPHEMERAL RAM</strong></span>
            <span className="text-slate-700">•</span>
            <span>DATA LEAKAGE: <strong className="text-emerald-400 font-mono">ZERO</strong></span>
          </div>
        </div>
      </section>

      {/* 3. CENTERPIECE: INTERACTIVE INSPECTION WORKBENCH SANDBOX */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Interactive Inspection Demo
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mt-1">
                Experience the sentence heatmap in real-time.
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-[60ch]">
                Click highlighted clauses to inspect exact matched corpora, overlap metrics, and attribution advice.
              </p>
            </div>

            {/* Discipline Switcher Tabs */}
            <div className="mt-4 md:mt-0 flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
              {SAMPLE_CASES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCaseId(c.id);
                    setActiveMatchId(c.sources[0]?.id || 1);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCaseId === c.id
                      ? 'bg-white text-slate-950 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {c.discipline}
                </button>
              ))}
            </div>
          </div>

          {/* Workbench Frame */}
          <div className="rounded-2xl border border-slate-200/90 bg-[#fafaf9] shadow-elevated overflow-hidden">
            
            {/* Workbench Top Bar */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></div>
                <span className="text-xs font-mono font-medium text-slate-700 ml-2 truncate max-w-xs sm:max-w-md">
                  {activeCase.paperTitle}.docx
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="text-slate-500">OVERALL SIMILARITY:</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-bold tabular-nums">
                  {activeCase.similarityScore}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${activeCase.riskClass}`}>
                  {activeCase.riskBadge}
                </span>
              </div>
            </div>

            {/* Split Inspection View: Document Text on Left, Match Inspector on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
              
              {/* Document Text View (7 Cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4 pb-2 border-b border-slate-100">
                    <span>DOCUMENT BODY SCAN</span>
                    <span>{activeCase.clauses.length} SENTENCES EVALUATED</span>
                  </div>

                  <div className="text-slate-800 text-base leading-relaxed font-sans space-y-2">
                    <p>
                      {activeCase.clauses.map((clause, idx) => {
                        if (!clause.isMatch) {
                          return <span key={idx}>{clause.text}</span>;
                        }
                        const isCurrent = clause.matchId === activeMatchId;
                        return (
                          <span
                            key={idx}
                            onClick={() => clause.matchId && setActiveMatchId(clause.matchId)}
                            className={`cursor-pointer transition-all rounded px-1 py-0.5 mx-0.5 border-b-2 font-medium ${
                              isCurrent
                                ? 'bg-amber-100 border-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-300/50'
                                : 'bg-yellow-50 border-yellow-400 text-slate-900 hover:bg-yellow-100'
                            }`}
                            title="Click to view detected attribution source"
                          >
                            {clause.text}
                            <span className="ml-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900">
                              #{clause.matchId}
                            </span>
                          </span>
                        );
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-400 inline-block"></span>
                    <span>Highlighted phrase represents identified similarity</span>
                  </div>
                  <span className="font-mono text-[11px]">Click phrase to inspect</span>
                </div>
              </div>

              {/* Attribution Inspector Panel (5 Cols) */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-[#f8fafc] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-4 pb-2 border-b border-slate-200">
                    <span className="flex items-center space-x-1.5 font-bold text-slate-900">
                      <Search className="w-3.5 h-3.5 text-blue-600" />
                      <span>SOURCE INSPECTOR</span>
                    </span>
                    <span className="bg-slate-200/80 px-2 py-0.5 rounded text-[10px] font-mono">
                      MATCH #{activeMatchId} of {activeCase.sources.length}
                    </span>
                  </div>

                  {/* Active Match Card */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {activeSource.citationType}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {activeSource.similarity}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-950 leading-snug">
                        {activeSource.title}
                      </h4>

                      <p className="text-xs text-slate-500 font-mono">
                        Published: {activeSource.venue} ({activeSource.year})
                      </p>
                    </div>

                    {/* Writing Recommendation Engine */}
                    <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 shadow-xs">
                      <div className="flex items-center space-x-1.5 text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Attribution Directive</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {activeSource.recommendation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Match Switcher Tabs */}
                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">
                    Found {activeCase.sources.length} indexed publications
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {activeCase.sources.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setActiveMatchId(s.id)}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all ${
                          activeMatchId === s.id
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Match #{s.id}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. ASYMMETRIC TECHNICAL BENTO: Anti-Slop Layout Architecture */}
      <section className="py-20 md:py-28 bg-[#fafaf9] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Engine Mechanics
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 mt-1 leading-tight">
              Rigorous lexical decomposition. Zero black-box guesswork.
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Every percentage score is mathematically derived from transparent shingle vectors and cross-referenced with exact citation tokens.
            </p>
          </div>

          {/* Asymmetric Bento Grid (2 large, 2 compact) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: 2-Column Wide - Multi-Tier Comparison Engine */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-white border border-slate-200 shadow-card flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-mono font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>ALGORITHM PIPELINE</span>
                </div>
                <h3 className="text-xl font-bold text-slate-950">
                  Sliding N-Gram Shingling & Paraphrase Dissection
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                  Simple text matchers look only for exact copies. Our engine breaks your document into overlapping 3-gram and 5-gram token windows, applying stopword-normalized Jaccard scoring to catch rearranged clauses, substituted synonyms, and disguised paraphrasing.
                </p>
              </div>

              {/* Technical Representation Diff */}
              <div className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs space-y-2 overflow-x-auto">
                <div className="text-slate-500">// Token Shingle Matrix</div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400">[SHINGLE 01]</span>
                  <span className="text-slate-200">&quot;consensus algorithm achieves understandability&quot;</span>
                  <span className="text-slate-500">→ J=0.89</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400">[SHINGLE 02]</span>
                  <span className="text-slate-200">&quot;achieves understandability through explicit leader&quot;</span>
                  <span className="text-slate-500">→ J=0.92</span>
                </div>
                <div className="text-blue-400 pt-1">
                  ✓ Vector match identified against USENIX Corpus #14092
                </div>
              </div>
            </div>

            {/* Card 2: 1-Column - Authenticated PDF Certificate */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-card flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-mono font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  <span>FACULTY VERIFICATION</span>
                </div>
                <h3 className="text-xl font-bold text-slate-950">
                  Cryptographic Verification Seal
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Export tamper-evident PDF certificates containing document SHA-256 hash, analysis timestamp, and itemized similarity breakdown to attach directly to assignments.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-500">
                  <span>CERTIFICATE ID</span>
                  <span className="text-slate-900 font-bold">#AP-8849-V2</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>SHA-256 HASH</span>
                  <span className="text-slate-900 font-bold truncate max-w-[120px]">e3b0c44298fc1c14</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>TIMESTAMP</span>
                  <span className="text-slate-900 font-bold">UTC 2026-09</span>
                </div>
              </div>
            </div>

            {/* Card 3: 1-Column - Student Privacy Guarantee */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-card flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-mono font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>ZERO-LEAK PROTOCOL</span>
                </div>
                <h3 className="text-xl font-bold text-slate-950">
                  Non-Indexing Repository Guarantee
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Unlike commercial submission checkers that ingest your original writing into public databases, your uploaded papers are evaluated strictly in isolated memory and never retained for crawler indexing.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs text-emerald-700 font-mono font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero third-party exposure</span>
              </div>
            </div>

            {/* Card 4: 2-Column Wide - Citation & Quotation Guidance */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-white border border-slate-200 shadow-card flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-mono font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>CITATION REFINEMENT</span>
                </div>
                <h3 className="text-xl font-bold text-slate-950">
                  Actionable Citation Synthesis Before Final Grading
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                  Don&apos;t panic over similarity percentages. The portal categorizes matches by structural intent: identifying legitimate cited references, missing quotation marks, or phrases that require restructuring in your distinct authorial style.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="font-mono font-bold text-slate-900 block mb-1">01. Verbatim Quotation</span>
                  <span className="text-slate-500 leading-normal">Surround matched passage with quotation punctuation and in-text author credit.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="font-mono font-bold text-slate-900 block mb-1">02. Synthetic Paraphrase</span>
                  <span className="text-slate-500 leading-normal">Express the underlying theoretical mechanism using your domain vocabulary.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="font-mono font-bold text-slate-900 block mb-1">03. Reference Attribution</span>
                  <span className="text-slate-500 leading-normal">Append full APA / IEEE / Harvard bibliographic metadata to the endnotes.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. ACADEMIC INTEGRITY EDITORIAL Q&A (Clean 2-Column, No Clunky Accordion) */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Standards & Guidelines
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 mt-1">
              Common questions on similarity thresholds.
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Essential knowledge for thesis writers, graduate researchers, and undergraduate submissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            <div className="space-y-2.5 pb-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-950">
                What similarity score does an academic committee expect?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Most universities and conference committees expect an aggregate similarity index below 15% to 20%, with standard bibliographies, methodology templates, and boilerplate definitions excluded. The key factor is never having an uncredited verbatim clause longer than 7–10 words.
              </p>
            </div>

            <div className="space-y-2.5 pb-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-950">
                Will submitting here trigger a Turnitin or university false positive?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Never. Our repository architecture is strictly non-indexing. Your documents remain encrypted in your private workspace and are never shared with academic crawler networks, institutional pools, or public indices.
              </p>
            </div>

            <div className="space-y-2.5 pb-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-950">
                How does the engine identify paraphrased passages?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our lexical pipeline calculates token frequency vectors and sliding n-gram shingles simultaneously. Even when synonyms are swapped or sentence clauses rearranged, vector clustering identifies borrowed semantic structures.
              </p>
            </div>

            <div className="space-y-2.5 pb-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-950">
                What file formats and sizes are permitted?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We accept Adobe PDF (.pdf), Microsoft Word (.docx), and plain text (.txt) files up to 10MB in size. Headings, footnotes, and paragraph structure are preserved automatically during token extraction.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION: High-Impact Editorial Closing */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-subtle opacity-10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 text-blue-400 text-xs font-mono font-medium border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            SUBMISSION QUEUE OPEN
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight max-w-2xl mx-auto">
            Verify academic originality before submitting your draft.
          </h2>

          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Join thousands of university students and independent scholars verifying thesis submissions with sentence-level transparency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href={user ? "/upload" : "/register"}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-[0.98]"
            >
              <UploadCloud className="w-4 h-4 text-slate-950" />
              <span>Upload Document Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              href={user ? "/dashboard" : "/login"}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium text-sm flex items-center justify-center transition-all active:scale-[0.98]"
            >
              <span>{user ? "View Saved Reports" : "Sign In to Portal"}</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
