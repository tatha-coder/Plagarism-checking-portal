'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { 
  FullReportData, 
  HighlightSegment, 
  SimilarityMatch 
} from '@/types';
import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Download, 
  Printer, 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  Layers, 
  ExternalLink, 
  X, 
  Sparkles,
  Award,
  Hash,
  GraduationCap
} from 'lucide-react';

interface ReportResponse {
  success: boolean;
  data: FullReportData & {
    highlightSegments: HighlightSegment[];
  };
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const reportId = params.id as string;
  const [data, setData] = useState<ReportResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeMatch, setActiveMatch] = useState<SimilarityMatch | null>(null);
  const [activeTab, setActiveTab] = useState<'interactive' | 'sources' | 'certificate'>('interactive');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/reports/${reportId}`);
        if (res.ok) {
          const json: ReportResponse = await res.json();
          setData(json.data);
        } else if (res.status === 401) {
          router.push('/login');
        } else {
          setError('Could not retrieve report or permission denied.');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-3 text-slate-500 text-sm">
          <div className="w-8 h-8 rounded-full border-2 border-academic-600 border-t-transparent animate-spin" />
          <span>Generating plagiarism analysis report...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-2xl bg-white border border-slate-200 shadow-card">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Report Unavailable</h2>
          <p className="text-xs text-slate-600">{error || 'Report not found'}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-academic-800 text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const { report, document: doc, student, matches, sourcesSummary, highlightSegments } = data;

  const getRiskDetails = (risk: string) => {
    switch (risk) {
      case 'low':
        return {
          title: 'Low Risk',
          color: 'text-emerald-700',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          ring: 'text-emerald-500',
          desc: 'Scholarly acceptable originality. Minor common phrases or citations.',
        };
      case 'moderate':
        return {
          title: 'Moderate Risk',
          color: 'text-amber-700',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          ring: 'text-amber-500',
          desc: 'Notable overlapping text detected. Citation checks recommended.',
        };
      case 'high':
        return {
          title: 'High Risk',
          color: 'text-orange-700',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          ring: 'text-orange-500',
          desc: 'Substantial matched content across academic references.',
        };
      case 'very_high':
      default:
        return {
          title: 'Critical Risk',
          color: 'text-red-700',
          bg: 'bg-red-50',
          border: 'border-red-200',
          ring: 'text-red-500',
          desc: 'High degree of verbatim text matching institutional corpus.',
        };
    }
  };

  const riskInfo = getRiskDetails(report.risk_level);

  const handleSegmentClick = (matchId?: string) => {
    if (!matchId) return;
    const match = matches.find(m => m.id === matchId);
    if (match) {
      setActiveMatch(match);
    }
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Top Breadcrumb & Action Bar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print border-b border-surface-border pb-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/history"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Back to History"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 truncate max-w-md">
                {doc.title}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 text-slate-700">
                {doc.file_type}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Report ID: <span className="font-mono">{report.id}</span> • Analyzed on{' '}
              {new Date(report.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Top Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
              activeTab === 'certificate'
                ? 'bg-academic-800 text-white border-academic-800 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-blue-300" />
            <span>Official Certificate</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Score & Metrics Hero Banner (Hidden in Print) */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card p-6 sm:p-8 no-print">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Big Score Dial */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-subtle border border-surface-border space-y-3">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={riskInfo.ring}
                  strokeDasharray={`${report.overall_score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-serif text-3xl font-bold text-slate-900 leading-none">
                  {report.overall_score}%
                </span>
                <span className="text-[10px] font-sans text-slate-500 uppercase tracking-wider font-semibold mt-1">
                  Similarity
                </span>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-bold ${riskInfo.bg} ${riskInfo.color} ${riskInfo.border} border`}>
              {riskInfo.title}
            </div>
            <p className="text-[11px] text-slate-500 text-center max-w-[220px]">
              {riskInfo.desc}
            </p>
          </div>

          {/* Center & Right: Document & Algorithm Breakdown */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Student & Document Meta Pills */}
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-academic-50/70 border border-academic-100 text-xs text-academic-900">
              <span className="font-semibold flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5 text-academic-700" />
                <span>{student.name}</span>
              </span>
              <span className="text-academic-300">•</span>
              <span className="font-mono">Roll: {student.roll_number}</span>
              <span className="text-academic-300">•</span>
              <span className="font-mono">Sec: {student.section}</span>
              <span className="text-academic-300">•</span>
              <span>{student.program}</span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Word Count</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{doc.word_count}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Matched Sources</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{report.matched_sources_count}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Passages Flagged</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{report.matched_passages_count}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Compute Time</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{report.analysis_duration_ms} ms</span>
              </div>
            </div>

            {/* Mathematical Engine Breakdown */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Multi-Algorithm Breakdown</span>
                <span className="text-[10px] font-mono text-slate-600">Deterministic Hybrid</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div>
                  <span className="text-slate-600 block text-[10px]">Exact Sentence Match:</span>
                  <span className="font-semibold text-slate-800">{report.algorithm_breakdown.exact_match_score}%</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">N-Gram Jaccard (N=3):</span>
                  <span className="font-semibold text-slate-800">{report.algorithm_breakdown.ngram_jaccard_score}%</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">TF-IDF Cosine Vector:</span>
                  <span className="font-semibold text-slate-800">{report.algorithm_breakdown.tfidf_cosine_score}%</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Flagged Sentences:</span>
                  <span className="font-semibold text-slate-800">
                    {report.algorithm_breakdown.flagged_sentences} / {report.algorithm_breakdown.total_sentences}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Interactive Document vs Matching Sources vs Certificate) */}
      <div className="border-b border-surface-border flex space-x-6 no-print">
        <button
          onClick={() => setActiveTab('interactive')}
          className={`pb-3 text-xs sm:text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'interactive'
              ? 'border-academic-700 text-academic-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Interactive Document Reader</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-academic-100 text-academic-800">
            {matches.length} matches
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`pb-3 text-xs sm:text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'sources'
              ? 'border-academic-700 text-academic-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Matching Sources ({sourcesSummary.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('certificate')}
          className={`pb-3 text-xs sm:text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'certificate'
              ? 'border-academic-700 text-academic-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Clearance Certificate</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE DOCUMENT READER (Split view with side-by-side comparison modal) */}
      {activeTab === 'interactive' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
          
          {/* Main Document Content */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-surface-border shadow-subtle p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Submitted Text Content
              </span>
              <span className="text-[11px] text-slate-600">
                * Click on highlighted text to view source comparison
              </span>
            </div>

            <div className="prose max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans selection:bg-academic-200">
              {highlightSegments.map((segment, idx) => {
                if (!segment.isHighlighted) {
                  return <span key={idx}>{segment.text}</span>;
                }
                const isSelected = activeMatch?.id === segment.matchId;
                return (
                  <mark
                    key={idx}
                    onClick={() => handleSegmentClick(segment.matchId)}
                    className={`highlight-passage ${isSelected ? 'active-match' : ''}`}
                    title={`Match found in: ${segment.sourceTitle || 'Corpus Reference'}`}
                  >
                    {segment.text}
                  </mark>
                );
              })}
            </div>
          </div>

          {/* Right Side: Active Match Inspector Drawer */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-surface-border shadow-subtle p-5 space-y-4 sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-semibold text-xs text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Passage Inspector</span>
                </h3>
                {activeMatch && (
                  <button
                    onClick={() => setActiveMatch(null)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {activeMatch ? (
                <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-600 block mb-1">
                      Matching Source
                    </span>
                    <div className="p-3 rounded-xl bg-academic-50 border border-academic-100 space-y-1">
                      <div className="font-bold text-academic-900 leading-tight">
                        {activeMatch.source_title}
                      </div>
                      <div className="text-[11px] text-academic-700 font-mono">
                        {activeMatch.source_author}
                      </div>
                      <div className="pt-1 flex items-center justify-between text-[10px]">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white text-academic-800 font-medium">
                          {activeMatch.source_type === 'academic_corpus' ? 'Institutional Corpus' : 'Student Submission'}
                        </span>
                        <span className="font-bold text-amber-700 font-mono">
                          {activeMatch.similarity_percentage}% match
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-600 block mb-1">
                      Uploaded Text Segment
                    </span>
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-slate-800 italic leading-relaxed">
                      "{activeMatch.matched_text}"
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-600 block mb-1">
                      Corpus Reference Passage
                    </span>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed font-mono text-[11px]">
                      "{activeMatch.source_text}"
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-2 text-slate-400">
                  <BookOpen className="w-8 h-8 mx-auto stroke-1" />
                  <p className="text-xs text-slate-500 font-medium">
                    No passage selected
                  </p>
                  <p className="text-[11px] text-slate-600 max-w-[200px] mx-auto">
                    Click any highlighted yellow text on the left to inspect its matching reference.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MATCHING SOURCES BREAKDOWN */}
      {activeTab === 'sources' && (
        <div className="bg-white rounded-2xl border border-surface-border shadow-subtle overflow-hidden no-print">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-serif text-base font-bold text-slate-900">
              Matched Sources & Cross-Citations
            </h3>
            <p className="text-xs text-slate-500">
              Ranked list of academic papers and repository documents contributing to the similarity score
            </p>
          </div>

          {sourcesSummary.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-surface-subtle border-b border-surface-border text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-6">Source Title</th>
                    <th className="py-3 px-6">Author / Journal</th>
                    <th className="py-3 px-6">Source Type</th>
                    <th className="py-3 px-6">Flagged Passages</th>
                    <th className="py-3 px-6 text-right">Similarity Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sourcesSummary.map((source, i) => (
                    <tr key={source.source_document_id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900 max-w-sm">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-academic-100 text-academic-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="truncate">{source.source_title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {source.source_author}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          {source.source_type === 'academic_corpus' ? 'Institutional Corpus' : 'Student Submission'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-700">
                        {source.match_count} passages
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-slate-900">
                        {source.matched_percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              No matching sources found in the database. Document appears completely original.
            </div>
          )}
        </div>
      )}

      {/* TAB 3 / PRINT VIEW: OFFICIAL PLAGIARISM CLEARANCE CERTIFICATE */}
      {(activeTab === 'certificate' || true) && (
        <div className={`certificate-page bg-white rounded-2xl border-2 border-academic-900 shadow-elevated p-8 sm:p-12 max-w-4xl mx-auto space-y-8 ${activeTab !== 'certificate' ? 'hidden print:block' : 'block'}`}>
          
          {/* Certificate Header */}
          <div className="text-center space-y-3 border-b-2 border-academic-900 pb-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-academic-50 border border-academic-200 text-xs font-semibold text-academic-900">
              <ShieldCheck className="w-4 h-4 text-academic-700" />
              <span>OFFICIAL ACADEMIC SIMILARITY CLEARANCE CERTIFICATE</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              School of Engineering & Technology
            </h2>
            <p className="text-xs text-slate-600 tracking-wider uppercase font-semibold">
              Department of Computer Science & Engineering • Academic Verification Division
            </p>
          </div>

          {/* Student & Document Details Grid */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50/70 p-6 rounded-xl border border-slate-200 text-xs">
            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Candidate Name</span>
                <span className="text-sm font-bold text-slate-900">{student.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Roll Number</span>
                <span className="text-sm font-mono font-semibold text-slate-900">{student.roll_number}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Section & Program</span>
                <span className="text-xs font-medium text-slate-800">Section {student.section} • {student.program}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Document Title</span>
                <span className="text-sm font-bold text-slate-900">{doc.title}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Word & Character Count</span>
                <span className="text-xs font-mono text-slate-800">{doc.word_count} words • {doc.char_count} characters</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Verification Timestamp</span>
                <span className="text-xs font-mono text-slate-800">{new Date(report.created_at).toUTCString()}</span>
              </div>
            </div>
          </div>

          {/* Plagiarism Score Box */}
          <div className="p-6 rounded-xl border-2 border-slate-900 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Official Similarity Score
              </span>
              <div className="text-4xl font-serif font-bold text-slate-900">
                {report.overall_score}%
              </div>
              <p className="text-xs text-slate-600">
                Categorized as: <strong className="uppercase">{report.risk_level.replace('_', ' ')}</strong>
              </p>
            </div>

            <div className="text-right space-y-1 text-xs">
              <div className="text-slate-600">Matched Sources: <strong>{report.matched_sources_count}</strong></div>
              <div className="text-slate-600">Flagged Passages: <strong>{report.matched_passages_count}</strong></div>
              <div className="text-slate-600">N-gram Overlap (N=3): <strong>{report.algorithm_breakdown.ngram_jaccard_score}%</strong></div>
              <div className="text-slate-600">TF-IDF Cosine: <strong>{report.algorithm_breakdown.tfidf_cosine_score}%</strong></div>
            </div>
          </div>

          {/* Declaration Statement */}
          <div className="text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-4 space-y-2">
            <p>
              <strong>Academic Integrity Declaration:</strong> This report is generated automatically by the institutional plagiarism checking portal. The computed similarity index represents the degree of verbatim and structural overlap detected between the submitted document and the active academic reference repository.
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 grid grid-cols-2 items-end border-t border-slate-200 text-xs">
            <div className="space-y-1">
              <div className="font-mono text-[10px] text-slate-600">DIGITAL CERTIFICATE ID:</div>
              <div className="font-mono font-bold text-slate-900 text-xs">{report.id}</div>
              <div className="text-[10px] text-slate-600">Digitally Verified by Institutional Plagiarism Engine</div>
            </div>

            <div className="text-right space-y-1">
              <div className="font-serif font-bold text-slate-900">Controller of Academic Examinations</div>
              <div className="text-[10px] text-slate-600">B.Tech Computer Science & Engineering</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
