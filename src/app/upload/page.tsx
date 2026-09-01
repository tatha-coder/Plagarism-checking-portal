'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
  UploadCloud, 
  FileText, 
  Type, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  File,
  X,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

const SAMPLE_TEXTS = {
  highPlagiarism: {
    title: 'Distributed Consensus and Raft Protocol Analysis',
    text: `Distributed consensus algorithms form the bedrock of fault-tolerant replicated systems. The Raft consensus algorithm is designed to be more understandable than Paxos while providing equivalent fault tolerance and performance. Raft achieves consensus through an elected leader that manages the replicated log. When a leader fails or disconnects, a new leader is elected through randomized election timers. Raft decomposes consensus into three independent subproblems: leader election, log replication, and safety. Log entries flow only in one direction, from the leader to the followers. Follower nodes accept entries from the leader and acknowledge them. Once a majority of followers acknowledge an entry, the leader commits it and applies it to its state machine.`
  },
  moderatePlagiarism: {
    title: 'Computational Complexity Analysis of Graph Traversal Algorithms',
    text: `Graph traversal and shortest path computation are crucial fundamentals in modern computer science. Dijkstra algorithm computes single-source shortest paths in weighted directed graphs with non-negative edge weights. By utilizing a min-priority heap or Fibonacci heap, Dijkstra achieves an impressive time complexity of O(V log V + E). Furthermore, we can design scalable distributed graph processing systems using topological sorting and parallel matrix representations to optimize memory caching across NUMA nodes in contemporary cloud infrastructure.`
  },
  originalWork: {
    title: 'Novel Quantum-Resistant Cryptographic Signatures for Zero-Trust Networks',
    text: `This paper presents a novel lattice-based digital signature scheme specifically optimized for constrained edge devices within zero-trust perimeter architectures. By combining module learning with errors (M-LWE) and customized rejection sampling protocols, our cryptographic implementation achieves signature sizes below 1.2 kilobytes while resisting subfield lattice attacks. Benchmark evaluations across heterogeneous ARM Cortex microcontrollers demonstrate a 34% reduction in verification latency compared to traditional post-quantum schemes without compromising security levels.`
  }
};

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState(user?.name || '');
  const [isCorpus, setIsCorpus] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError('');
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext || '')) {
      setError('Invalid file format. Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }
    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSampleSelect = (sampleKey: keyof typeof SAMPLE_TEXTS) => {
    setActiveTab('text');
    setTitle(SAMPLE_TEXTS[sampleKey].title);
    setRawText(SAMPLE_TEXTS[sampleKey].text);
    setError('');
  };

  const startAnalysis = async () => {
    setError('');

    if (activeTab === 'file' && !selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    if (activeTab === 'text' && (!rawText || rawText.trim().length < 20)) {
      setError('Please enter at least 20 characters of text to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep(1);

    const stepTimer1 = setTimeout(() => setAnalysisStep(2), 500);
    const stepTimer2 = setTimeout(() => setAnalysisStep(3), 1100);
    const stepTimer3 = setTimeout(() => setAnalysisStep(4), 1700);

    try {
      const formData = new FormData();
      if (activeTab === 'file' && selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('rawText', rawText);
      }
      formData.append('title', title || (selectedFile?.name ?? 'Untitled Submission'));
      formData.append('authorName', authorName || user?.name || 'Anonymous Student');
      if (isCorpus && user?.role === 'admin') {
        formData.append('isCorpus', 'true');
      }

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = await res.json();

      if (res.ok) {
        if (data.reportId) {
          router.push(`/reports/${data.reportId}`);
        } else if (data.isCorpus || isCorpus) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setIsAnalyzing(false);
        setError(data.error || 'Analysis failed. Please try again.');
      }
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsAnalyzing(false);
      setError('A network or server error occurred during analysis.');
    }
  };

  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const charCount = rawText.length;

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Check a Document
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Upload a file or paste text below to generate an instant similarity breakdown.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card p-6 sm:p-8 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Systems Final Paper"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-academic-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Author / Student Name
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-academic-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="border-b border-slate-200 flex space-x-6">
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'file'
                ? 'border-academic-700 text-academic-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload File (PDF / DOCX / TXT)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'text'
                ? 'border-academic-700 text-academic-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Direct Text Editor</span>
          </button>
        </div>

        {/* Tab 1: File Upload */}
        {activeTab === 'file' && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-academic-600 bg-academic-50/60'
                  : selectedFile
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-academic-400 bg-slate-50/40 hover:bg-academic-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                className="hidden"
              />

              {selectedFile ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <File className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500 font-mono">
                      {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.name.split('.').pop()?.toUpperCase()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="inline-flex items-center space-x-1 text-xs text-red-600 hover:text-red-800 font-medium pt-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove file</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-academic-100 text-academic-700 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-800">
                      Click to browse or drag & drop document
                    </p>
                    <p className="text-xs text-slate-500">
                      Supports PDF, Microsoft Word (.docx), and plain text (.txt) up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Direct Text Editor */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Document Body</span>
              <span className="font-mono">
                {wordCount} words • {charCount} characters
              </span>
            </div>
            <textarea
              rows={9}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste or type academic content, thesis sections, or assignment text here..."
              className="w-full p-4 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-academic-500 bg-slate-50/40 leading-relaxed font-sans"
            />
          </div>
        )}

        {/* Sample Texts */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="text-xs font-medium text-slate-700">
            Or load a sample document:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleSampleSelect('highPlagiarism')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-xs text-slate-700 font-medium transition-colors"
            >
              Sample 1: Raft Protocol
            </button>
            <button
              type="button"
              onClick={() => handleSampleSelect('moderatePlagiarism')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-xs text-slate-700 font-medium transition-colors"
            >
              Sample 2: Graph Algorithms
            </button>
            <button
              type="button"
              onClick={() => handleSampleSelect('originalWork')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-xs text-slate-700 font-medium transition-colors"
            >
              Sample 3: Original Research
            </button>
          </div>
        </div>

        {/* Admin Corpus Toggle */}
        {user?.role === 'admin' && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
            <input
              type="checkbox"
              id="isCorpus"
              checked={isCorpus}
              onChange={(e) => setIsCorpus(e.target.checked)}
              className="rounded text-slate-900 focus:ring-slate-900 w-4 h-4"
            />
            <label htmlFor="isCorpus" className="text-xs text-slate-700 font-medium cursor-pointer">
              Save as baseline comparison document (Admin)
            </label>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={startAnalysis}
          disabled={isAnalyzing}
          className="w-full py-3 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
        >
          {isAnalyzing ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Checking Document...</span>
            </div>
          ) : (
            <>
              <span>{isCorpus ? 'Save to Corpus' : 'Run Check'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Real-time Analysis Progress Modal */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-elevated space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-academic-100 text-academic-700 flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6 animate-spin text-academic-700" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Running Similarity Pipeline
              </h3>
              <p className="text-xs text-slate-500">
                Executing multi-algorithm mathematical comparison against institutional database
              </p>
            </div>

            {/* Steps Progress */}
            <div className="space-y-3 font-sans text-xs">
              <div className={`flex items-center space-x-3 p-2.5 rounded-lg ${analysisStep >= 1 ? 'bg-academic-50 text-academic-900 font-semibold' : 'text-slate-400'}`}>
                {analysisStep > 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-academic-600 border-t-transparent animate-spin shrink-0" />
                )}
                <span>1. Text extraction & tokenization</span>
              </div>

              <div className={`flex items-center space-x-3 p-2.5 rounded-lg ${analysisStep >= 2 ? 'bg-academic-50 text-academic-900 font-semibold' : 'text-slate-400'}`}>
                {analysisStep > 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : analysisStep === 2 ? (
                  <div className="w-4 h-4 rounded-full border-2 border-academic-600 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />
                )}
                <span>2. Generating 3-gram shingles & sentence spans</span>
              </div>

              <div className={`flex items-center space-x-3 p-2.5 rounded-lg ${analysisStep >= 3 ? 'bg-academic-50 text-academic-900 font-semibold' : 'text-slate-400'}`}>
                {analysisStep > 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : analysisStep === 3 ? (
                  <div className="w-4 h-4 rounded-full border-2 border-academic-600 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />
                )}
                <span>3. TF-IDF cosine & Jaccard index cross-matching</span>
              </div>

              <div className={`flex items-center space-x-3 p-2.5 rounded-lg ${analysisStep >= 4 ? 'bg-academic-50 text-academic-900 font-semibold' : 'text-slate-400'}`}>
                {analysisStep === 4 ? (
                  <div className="w-4 h-4 rounded-full border-2 border-academic-600 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />
                )}
                <span>4. Compiling interactive report & passage offsets</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
