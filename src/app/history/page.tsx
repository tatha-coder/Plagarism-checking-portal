'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  FileText, 
  ArrowUpDown, 
  UploadCloud, 
  ExternalLink, 
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface ReportListItem {
  report: {
    id: string;
    document_id: string;
    overall_score: number;
    risk_level: 'low' | 'moderate' | 'high' | 'very_high';
    created_at: string;
  };
  document: {
    id: string;
    title: string;
    filename: string;
    file_type: string;
    file_size: number;
    word_count: number;
    created_at: string;
  };
  owner?: {
    id: string;
    name: string;
    email: string;
    roll_number: string;
    section: string;
    program: string;
  };
}

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskLevel, setRiskLevel] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (riskLevel !== 'all') params.append('riskLevel', riskLevel);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await fetch(`/api/reports?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setReports(json.data || []);
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchReports();
      }
    }
  }, [user, authLoading, search, riskLevel, sortBy]);

  const handleDelete = async (docId: string) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirmId(null);
        fetchReports();
      } else {
        const json = await res.json();
        alert(json.error || 'Failed to delete submission');
      }
    } catch (err) {
      alert('Error deleting submission');
    } finally {
      setIsDeleting(false);
    }
  };

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

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-academic-700" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Submissions History & Archive
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Search, filter, inspect reports, or manage past document submissions
          </p>
        </div>

        <Link
          href="/upload"
          className="px-4 py-2.5 rounded-xl bg-academic-800 hover:bg-academic-900 text-white font-semibold text-xs flex items-center space-x-2 shadow-sm transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          <span>New Submission</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-surface-border shadow-subtle grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by document title..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-academic-500 bg-slate-50/50"
          />
        </div>

        {/* Risk Filter */}
        <div className="relative">
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-academic-500 bg-slate-50/50 text-slate-800"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk (0-15%)</option>
            <option value="moderate">Moderate (16-30%)</option>
            <option value="high">High Risk (31-50%)</option>
            <option value="very_high">Critical (&gt; 50%)</option>
          </select>
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-academic-500 bg-slate-50/50 text-slate-800"
          >
            <option value="date_desc">Newest Submissions First</option>
            <option value="date_asc">Oldest Submissions First</option>
            <option value="score_desc">Highest Similarity First</option>
            <option value="score_asc">Lowest Similarity First</option>
          </select>
        </div>
      </div>

      {/* Submissions List Table */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3 text-slate-500 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-academic-600" />
            <span>Fetching submissions...</span>
          </div>
        ) : reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-surface-subtle border-b border-surface-border text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Document</th>
                  {user?.role === 'admin' && <th className="py-3.5 px-6">Student</th>}
                  <th className="py-3.5 px-6">Word Count</th>
                  <th className="py-3.5 px-6">Similarity Score</th>
                  <th className="py-3.5 px-6">Submission Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((item) => (
                  <tr key={item.report.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-academic-50 border border-academic-200 text-academic-800 flex items-center justify-center font-mono text-[10px] uppercase font-bold shrink-0">
                          {item.document.file_type}
                        </div>
                        <div className="truncate max-w-xs">
                          <div className="truncate font-semibold text-slate-900">{item.document.title}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{item.document.filename}</div>
                        </div>
                      </div>
                    </td>

                    {user?.role === 'admin' && (
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">{item.owner?.name || 'Unknown'}</div>
                        <div className="text-[10px] font-mono text-slate-500">{item.owner?.roll_number}</div>
                      </td>
                    )}

                    <td className="py-4 px-6 font-mono text-slate-600">
                      {item.document.word_count} words
                    </td>

                    <td className="py-4 px-6">
                      {getRiskBadge(item.report.risk_level, item.report.overall_score)}
                    </td>

                    <td className="py-4 px-6 text-slate-500 text-[11px]">
                      {new Date(item.report.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        href={`/reports/${item.report.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-academic-50 hover:bg-academic-100 text-academic-800 font-semibold text-xs transition-colors"
                      >
                        <span>View Report</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => setDeleteConfirmId(item.document.id)}
                        className="inline-flex items-center p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Submission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
            <div className="text-sm font-semibold text-slate-800">No submissions matching criteria</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Adjust your search keywords or upload a new paper to start plagiarism checking.
            </p>
            <div className="pt-2">
              <Link
                href="/upload"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-academic-800 text-white text-xs font-semibold shadow-sm"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Check New Document</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-elevated space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-base text-slate-900">Delete Submission?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete this document and its associated plagiarism report? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
