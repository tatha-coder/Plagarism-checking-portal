'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  BookOpen, 
  Settings, 
  Plus, 
  CheckCircle2, 
  RefreshCw, 
  Search,
  Sliders,
  Award,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { SystemSettings } from '@/types';

interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalSubmissions: number;
  totalCorpusDocuments: number;
  averageSimilarity: number;
  highRiskCount: number;
  riskCounts: {
    low: number;
    moderate: number;
    high: number;
    very_high: number;
  };
  userStats: {
    id: string;
    name: string;
    email: string;
    roll_number: string;
    section: string;
    program: string;
    submissionCount: number;
    averageSimilarity: number;
    flaggedSubmissions: number;
    createdAt: string;
  }[];
}

interface CorpusDoc {
  id: string;
  title: string;
  filename: string;
  word_count: number;
  author_name?: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [corpusList, setCorpusList] = useState<CorpusDoc[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'corpus' | 'settings'>('overview');

  // New Corpus Form
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newText, setNewText] = useState('');
  const [isAddingCorpus, setIsAddingCorpus] = useState(false);
  const [corpusMsg, setCorpusMsg] = useState('');

  // Settings Form
  const [settingsMsg, setSettingsMsg] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, corpusRes, settingsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/corpus'),
        fetch('/api/admin/settings'),
      ]);

      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData.stats);
      }
      if (corpusRes.ok) {
        const cData = await corpusRes.json();
        setCorpusList(cData.corpus || []);
      }
      if (settingsRes.ok) {
        const stData = await settingsRes.json();
        setSettings(stData.settings);
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
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      } else {
        fetchAdminData();
      }
    }
  }, [user, authLoading]);

  const handleAddCorpus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingCorpus(true);
    setCorpusMsg('');

    try {
      const res = await fetch('/api/admin/corpus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          author: newAuthor,
          text: newText,
        }),
      });

      const json = await res.json();
      setIsAddingCorpus(false);

      if (res.ok) {
        setCorpusMsg('Reference document added to corpus successfully!');
        setNewTitle('');
        setNewAuthor('');
        setNewText('');
        fetchAdminData();
      } else {
        alert(json.error || 'Failed to add corpus document');
      }
    } catch (e) {
      setIsAddingCorpus(false);
      alert('Error adding document to corpus');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSavingSettings(true);
    setSettingsMsg('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      setIsSavingSettings(false);

      if (res.ok) {
        setSettingsMsg('Engine parameters updated successfully!');
      } else {
        alert(json.error || 'Failed to save settings');
      }
    } catch (e) {
      setIsSavingSettings(false);
      alert('Error updating settings');
    }
  };

  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'student' : 'admin';
    if (!confirm(`Are you sure you want to change this user's role to ${nextRole}?`)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: nextRole }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      alert('Failed to update role');
    }
  };

  if (authLoading || (loading && !stats)) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-3 text-slate-500 text-sm">
          <RefreshCw className="w-6 h-6 animate-spin text-academic-700" />
          <span>Loading administrator portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      
      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-academic-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-white/10 text-xs font-mono backdrop-blur-sm text-blue-200">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-300" />
            <span>Faculty & Administrator Control Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Institutional Plagiarism Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Monitor submissions across departments, manage institutional reference papers, and calibrate algorithm sensitivity.
          </p>
        </div>

        <Link
          href="/history"
          className="shrink-0 px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <FileText className="w-4 h-4 text-academic-700" />
          <span>Inspect All Submissions</span>
        </Link>
      </div>

      {/* 5 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-surface-border shadow-subtle space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-600">Total Users</span>
          <div className="text-2xl font-bold text-slate-900">{stats?.totalUsers || 0}</div>
          <span className="text-[10px] text-slate-600">{stats?.totalStudents} students</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-surface-border shadow-subtle space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-600">Total Submissions</span>
          <div className="text-2xl font-bold text-slate-900">{stats?.totalSubmissions || 0}</div>
          <span className="text-[10px] text-slate-600">Analyzed documents</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-surface-border shadow-subtle space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-600">Corpus Documents</span>
          <div className="text-2xl font-bold text-academic-700">{stats?.totalCorpusDocuments || 0}</div>
          <span className="text-[10px] text-slate-600">Active benchmarks</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-surface-border shadow-subtle space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-600">System Avg Similarity</span>
          <div className="text-2xl font-bold text-slate-900">{stats?.averageSimilarity || 0}%</div>
          <span className="text-[10px] text-slate-600">Institutional mean</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-surface-border shadow-subtle space-y-1">
          <span className="text-[10px] font-bold uppercase text-red-600">High-Risk Flags</span>
          <div className="text-2xl font-bold text-red-600">{stats?.highRiskCount || 0}</div>
          <span className="text-[10px] text-slate-600">&gt; 30% similarity</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="border-b border-surface-border flex space-x-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs sm:text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-academic-700 text-academic-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Student Submissions Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab('corpus')}
          className={`pb-3 text-xs sm:text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'corpus'
              ? 'border-academic-700 text-academic-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Reference Corpus Manager ({corpusList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-xs sm:text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'border-academic-700 text-academic-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Engine Parameters & Sensitivity</span>
        </button>
      </div>

      {/* TAB 1: STUDENT PERFORMANCE LEADERBOARD */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-surface-border shadow-subtle overflow-hidden space-y-0">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-slate-900">
                Registered Students & Performance Statistics
              </h3>
              <p className="text-xs text-slate-500">
                Summary of submissions and average similarity rating per student
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-surface-subtle border-b border-surface-border text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Student Name</th>
                  <th className="py-3.5 px-6">Roll Number</th>
                  <th className="py-3.5 px-6">Section & Program</th>
                  <th className="py-3.5 px-6">Total Checks</th>
                  <th className="py-3.5 px-6">Mean Similarity</th>
                  <th className="py-3.5 px-6">Flagged Papers</th>
                  <th className="py-3.5 px-6 text-right">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.userStats && stats.userStats.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      <div>{s.name}</div>
                      <div className="text-[11px] text-slate-400">{s.email}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-700">
                      {s.roll_number}
                    </td>
                    <td className="py-4 px-6">
                      Sec {s.section} • {s.program}
                    </td>
                    <td className="py-4 px-6 font-mono font-semibold text-slate-900">
                      {s.submissionCount}
                    </td>
                    <td className="py-4 px-6 font-mono font-semibold">
                      <span className={s.averageSimilarity > 30 ? 'text-red-600' : 'text-slate-800'}>
                        {s.averageSimilarity}%
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-red-600 font-semibold">
                      {s.flaggedSubmissions}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleUserRole(s.id, 'student')}
                        className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 text-[11px] font-medium text-slate-700"
                        title="Promote to Admin"
                      >
                        Student
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REFERENCE CORPUS MANAGER */}
      {activeTab === 'corpus' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Active Corpus List */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-surface-border shadow-subtle p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-900">
                Active Benchmark Corpus Documents ({corpusList.length})
              </h3>
              <p className="text-xs text-slate-500">
                Scholarly baseline papers used for sentence segmentation and N-gram cross-matching
              </p>
            </div>

            <div className="space-y-3">
              {corpusList.map((doc, idx) => (
                <div key={doc.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-xs text-slate-900 leading-snug">
                      {doc.title}
                    </div>
                    <span className="text-[10px] font-mono text-academic-700 bg-academic-50 px-1.5 py-0.5 rounded shrink-0 ml-2">
                      {doc.word_count} words
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {doc.author_name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Add New Corpus Document Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-surface-border shadow-subtle p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-xs text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-academic-700" />
                <span>Add Reference Document</span>
              </h3>
              <p className="text-xs text-slate-500">
                Inject a new paper directly into the institutional comparison database
              </p>
            </div>

            {corpusMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{corpusMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddCorpus} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Paper / Reference Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Asymptotic Complexity in Graph Algorithms"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-academic-500 bg-slate-50/50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Author / Citation Info
                </label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Dr. Dijkstra (ACM Review 2023)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-academic-500 bg-slate-50/50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Full Text Content
                </label>
                <textarea
                  rows={8}
                  required
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Paste complete scholarly text or textbook chapter here..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-academic-500 bg-slate-50/50 leading-relaxed font-sans text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={isAddingCorpus}
                className="w-full py-2.5 px-4 rounded-xl bg-academic-800 hover:bg-academic-900 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50"
              >
                {isAddingCorpus ? 'Storing in Corpus...' : 'Add Paper to Active Corpus'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: ENGINE SETTINGS & PARAMETERS */}
      {activeTab === 'settings' && settings && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-surface-border shadow-subtle p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Plagiarism Algorithm Calibration & Thresholds
            </h3>
            <p className="text-xs text-slate-500">
              Adjust sensitivity, N-gram token windows, and composite scoring weights
            </p>
          </div>

          {settingsMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{settingsMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-5">
            {/* N-Gram Window */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>N-Gram Token Shingle Size (N)</span>
                <span className="font-mono text-academic-700">{settings.ngram_size} Words</span>
              </div>
              <input
                type="range"
                min={2}
                max={7}
                value={settings.ngram_size}
                onChange={(e) => setSettings({ ...settings, ngram_size: Number(e.target.value) })}
                className="w-full accent-academic-700"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Higher N values target larger verbatim phrase blocks, while lower N values catch fuzzy matches.
              </p>
            </div>

            {/* Thresholds */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-emerald-700 mb-1">
                  Low Risk Max (%)
                </label>
                <input
                  type="number"
                  min={5}
                  max={25}
                  value={settings.similarity_threshold_low}
                  onChange={(e) => setSettings({ ...settings, similarity_threshold_low: Number(e.target.value) })}
                  className="w-full p-2 text-xs rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-700 mb-1">
                  Moderate Risk Max (%)
                </label>
                <input
                  type="number"
                  min={20}
                  max={45}
                  value={settings.similarity_threshold_moderate}
                  onChange={(e) => setSettings({ ...settings, similarity_threshold_moderate: Number(e.target.value) })}
                  className="w-full p-2 text-xs rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-orange-700 mb-1">
                  High Risk Max (%)
                </label>
                <input
                  type="number"
                  min={40}
                  max={70}
                  value={settings.similarity_threshold_high}
                  onChange={(e) => setSettings({ ...settings, similarity_threshold_high: Number(e.target.value) })}
                  className="w-full p-2 text-xs rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            {/* Weights */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Composite Algorithm Weights (Must sum to ~1.0)
              </span>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-600 block mb-1">Exact Match (40%):</span>
                  <input
                    type="number"
                    step="0.05"
                    value={settings.exact_match_weight}
                    onChange={(e) => setSettings({ ...settings, exact_match_weight: Number(e.target.value) })}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-600 block mb-1">N-Gram Jaccard (35%):</span>
                  <input
                    type="number"
                    step="0.05"
                    value={settings.ngram_weight}
                    onChange={(e) => setSettings({ ...settings, ngram_weight: Number(e.target.value) })}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-600 block mb-1">TF-IDF Cosine (25%):</span>
                  <input
                    type="number"
                    step="0.05"
                    value={settings.cosine_weight}
                    onChange={(e) => setSettings({ ...settings, cosine_weight: Number(e.target.value) })}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-6 py-2.5 rounded-xl bg-academic-800 hover:bg-academic-900 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50"
              >
                {isSavingSettings ? 'Saving...' : 'Save Algorithm Calibration'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
