'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  BarChart2, 
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface DashboardData {
  totalChecked: number;
  averageSimilarity: number;
  highestSimilarity: number;
  riskCounts: {
    low: number;
    moderate: number;
    high: number;
    very_high: number;
  };
  recentSubmissions: {
    reportId: string;
    documentId: string;
    title: string;
    filename: string;
    fileType: string;
    wordCount: number;
    overallScore: number;
    riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
    createdAt: string;
  }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const json = await res.json();
        setData(json.stats);
      } else if (res.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchStats();
      }
    }
  }, [user, authLoading]);

  const getRiskBadge = (risk: string, score: number) => {
    switch (risk) {
      case 'low':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {score}% • Low Risk
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            {score}% • Moderate
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            {score}% • High Risk
          </span>
        );
      case 'very_high':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            {score}% • Critical
          </span>
        );
      default:
        return null;
    }
  };

  if (authLoading || (loading && !data)) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-3 text-slate-500 text-sm">
          <RefreshCw className="w-6 h-6 animate-spin text-academic-600" />
          <span>Loading academic dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="text-sm text-slate-600 max-w-xl">
            View your recent submissions and check new documents for similarity.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/upload"
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm flex items-center space-x-2 transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Check New Document</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl bg-white border border-surface-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Checked</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-academic-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-foreground">
            {data?.totalChecked || 0}
          </div>
          <p className="text-[11px] text-slate-500">
            Documents submitted to repository
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl bg-white border border-surface-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Similarity</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-foreground">
            {data?.averageSimilarity || 0}%
          </div>
          <p className="text-[11px] text-slate-500">
            Mean similarity score across all runs
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl bg-white border border-surface-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Highest Similarity</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-foreground">
            {data?.highestSimilarity || 0}%
          </div>
          <p className="text-[11px] text-slate-500">
            Peak match score detected
          </p>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-2xl bg-white border border-surface-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Risk Ratio</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-foreground">
            {data?.totalChecked ? Math.round(((data.riskCounts.low + data.riskCounts.moderate) / data.totalChecked) * 100) : 100}%
          </div>
          <p className="text-[11px] text-slate-500">
            Within acceptable academic threshold
          </p>
        </div>
      </div>

      {/* Risk Distribution Breakdown & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Bar */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-surface-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-academic-700" />
              <span>Similarity Risk Breakdown</span>
            </h3>
            <span className="text-xs text-slate-500">
              {data?.totalChecked || 0} Total Submissions
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${data?.totalChecked ? ((data.riskCounts.low) / data.totalChecked) * 100 : 0}%` }}
              className="bg-emerald-500 transition-all duration-500" 
              title={`Low Risk: ${data?.riskCounts.low || 0}`}
            />
            <div 
              style={{ width: `${data?.totalChecked ? ((data.riskCounts.moderate) / data.totalChecked) * 100 : 0}%` }}
              className="bg-amber-500 transition-all duration-500" 
              title={`Moderate: ${data?.riskCounts.moderate || 0}`}
            />
            <div 
              style={{ width: `${data?.totalChecked ? ((data.riskCounts.high) / data.totalChecked) * 100 : 0}%` }}
              className="bg-orange-500 transition-all duration-500" 
              title={`High Risk: ${data?.riskCounts.high || 0}`}
            />
            <div 
              style={{ width: `${data?.totalChecked ? ((data.riskCounts.very_high) / data.totalChecked) * 100 : 0}%` }}
              className="bg-red-500 transition-all duration-500" 
              title={`Critical: ${data?.riskCounts.very_high || 0}`}
            />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="flex items-center space-x-2 text-xs">
              <span className="w-3 h-3 rounded bg-emerald-500 shrink-0"></span>
              <span className="text-slate-600">Low (0-15%): <strong>{data?.riskCounts.low || 0}</strong></span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="w-3 h-3 rounded bg-amber-500 shrink-0"></span>
              <span className="text-slate-600">Mod (16-30%): <strong>{data?.riskCounts.moderate || 0}</strong></span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="w-3 h-3 rounded bg-orange-500 shrink-0"></span>
              <span className="text-slate-600">High (31-50%): <strong>{data?.riskCounts.high || 0}</strong></span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="w-3 h-3 rounded bg-red-500 shrink-0"></span>
              <span className="text-slate-600">Critical (&gt;50%): <strong>{data?.riskCounts.very_high || 0}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick CTA Card */}
        <div className="p-6 rounded-2xl bg-academic-50/70 border border-academic-200 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-academic-800 font-semibold text-sm">
              <UploadCloud className="w-4 h-4" />
              <span>Direct Analysis Mode</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Support for PDF documents, Word .docx files, or direct copy-pasted text. Analysis executes instantly against our 6-domain academic corpus.
            </p>
          </div>

          <Link
            href="/upload"
            className="w-full py-2.5 px-4 rounded-xl bg-academic-800 hover:bg-academic-900 text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
          >
            <span>Upload Document</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Submissions Section */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-subtle overflow-hidden space-y-0">
        <div className="p-6 border-b border-surface-border flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Recent Submissions & Reports
            </h3>
            <p className="text-xs text-slate-500">
              Latest documents analyzed with overall similarity ratings
            </p>
          </div>
          <Link
            href="/history"
            className="text-xs font-semibold text-academic-700 hover:text-academic-900 flex items-center space-x-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data?.recentSubmissions && data.recentSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-surface-subtle border-b border-surface-border text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-6">Document Title</th>
                  <th className="py-3 px-6">Format</th>
                  <th className="py-3 px-6">Word Count</th>
                  <th className="py-3 px-6">Similarity Score</th>
                  <th className="py-3 px-6">Submitted Date</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentSubmissions.map((sub) => (
                  <tr key={sub.reportId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate max-w-xs">{sub.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 uppercase font-mono text-[11px] text-slate-500">
                      {sub.fileType}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600">
                      {sub.wordCount} words
                    </td>
                    <td className="py-4 px-6">
                      {getRiskBadge(sub.riskLevel, sub.overallScore)}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-[11px]">
                      {new Date(sub.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/reports/${sub.reportId}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-academic-50 hover:bg-academic-100 text-academic-700 font-semibold text-xs transition-colors"
                      >
                        <span>View Report</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-800">No submissions found yet</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload your first document or paste text to perform automated similarity analysis.
            </p>
            <div className="pt-2">
              <Link
                href="/upload"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-academic-800 text-white text-xs font-semibold shadow-sm hover:bg-academic-900"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload First Document</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
