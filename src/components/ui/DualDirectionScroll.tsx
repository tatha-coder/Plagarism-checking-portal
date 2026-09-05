'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ExternalLink,
  Play,
  Pause,
  ArrowUpDown,
  Zap,
  Clock,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface ScanRecord {
  id: string;
  title: string;
  category: string;
  similarity: number;
  riskLevel: 'clean' | 'low' | 'moderate' | 'high';
  matchedSources: number;
  wordCount: number;
  timeAgo: string;
  institution: string;
  statusBadge: string;
}

const UP_COLUMN_RECORDS: ScanRecord[] = [
  {
    id: 'scan-1',
    title: 'Transformer Attention & Sparse Matrix Multiplications',
    category: 'Computer Science • Thesis Draft',
    similarity: 4.8,
    riskLevel: 'clean',
    matchedSources: 1,
    wordCount: 8420,
    timeAgo: 'Just now',
    institution: 'School of Computing',
    statusBadge: 'Verified Original'
  },
  {
    id: 'scan-2',
    title: 'Distributed Consensus & Byzantine Fault Tolerance',
    category: 'Distributed Systems • Research Paper',
    similarity: 14.2,
    riskLevel: 'low',
    matchedSources: 4,
    wordCount: 5210,
    timeAgo: '3m ago',
    institution: 'Dept. of Software Eng.',
    statusBadge: 'Citations Formatted'
  },
  {
    id: 'scan-3',
    title: 'Off-Target Cleavage Kinetics in Cas9 Variants',
    category: 'Biochemistry • Lab Report',
    similarity: 2.3,
    riskLevel: 'clean',
    matchedSources: 0,
    wordCount: 3950,
    timeAgo: '7m ago',
    institution: 'Institute of Life Sciences',
    statusBadge: 'Exceptional Originality'
  },
  {
    id: 'scan-4',
    title: 'Empirical Analysis of Algorithmic Monopolies',
    category: 'Law & Economics • Term Essay',
    similarity: 19.6,
    riskLevel: 'moderate',
    matchedSources: 6,
    wordCount: 6840,
    timeAgo: '12m ago',
    institution: 'Faculty of Law',
    statusBadge: 'Review Suggested'
  },
  {
    id: 'scan-5',
    title: 'Post-Quantum Lattice Cryptography Standards',
    category: 'Cybersecurity • Capstone',
    similarity: 6.1,
    riskLevel: 'clean',
    matchedSources: 2,
    wordCount: 7100,
    timeAgo: '18m ago',
    institution: 'Dept. of Applied Math',
    statusBadge: 'Verified Original'
  }
];

const DOWN_COLUMN_RECORDS: ScanRecord[] = [
  {
    id: 'scan-6',
    title: 'Neural Radiance Fields for Dense 3D Reconstruction',
    category: 'Computer Vision • Conference Submission',
    similarity: 7.9,
    riskLevel: 'clean',
    matchedSources: 2,
    wordCount: 6200,
    timeAgo: '1m ago',
    institution: 'Robotics Institute',
    statusBadge: 'Clean Attribution'
  },
  {
    id: 'scan-7',
    title: 'Microbial Metabolic Pathways in Arid Soil Crusts',
    category: 'Ecology & Environmental Sci • Seminar Paper',
    similarity: 11.4,
    riskLevel: 'low',
    matchedSources: 3,
    wordCount: 4480,
    timeAgo: '5m ago',
    institution: 'Dept. of Environmental Sci',
    statusBadge: 'Low Similarity'
  },
  {
    id: 'scan-8',
    title: 'Socioeconomic Predictors of Telemedicine Adoption',
    category: 'Public Health • Field Study',
    similarity: 8.7,
    riskLevel: 'clean',
    matchedSources: 2,
    wordCount: 5930,
    timeAgo: '9m ago',
    institution: 'School of Public Health',
    statusBadge: 'Verified Original'
  },
  {
    id: 'scan-9',
    title: 'Asynchronous Event-Driven Architectures at Scale',
    category: 'Software Architecture • Capstone Project',
    similarity: 16.8,
    riskLevel: 'moderate',
    matchedSources: 5,
    wordCount: 7850,
    timeAgo: '15m ago',
    institution: 'School of Information Systems',
    statusBadge: 'Paraphrase Notice'
  },
  {
    id: 'scan-10',
    title: 'Graph Neural Networks for Drug-Target Interaction',
    category: 'Bioinformatics • Doctoral Proposal',
    similarity: 3.5,
    riskLevel: 'clean',
    matchedSources: 1,
    wordCount: 9400,
    timeAgo: '22m ago',
    institution: 'Dept. of Computational Bio',
    statusBadge: 'Verified Original'
  }
];

function getRiskBadge(similarity: number, riskLevel: string) {
  if (riskLevel === 'clean' || similarity < 10) {
    return {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      text: `${similarity}% Match`
    };
  } else if (riskLevel === 'low' || similarity < 15) {
    return {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
      text: `${similarity}% Match`
    };
  } else if (riskLevel === 'moderate' || similarity < 25) {
    return {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      text: `${similarity}% Match`
    };
  }
  return {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    text: `${similarity}% Match`
  };
}

export default function DualDirectionScroll() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [reversed, setReversed] = useState(false);
  const [speed, setSpeed] = useState<'normal' | 'slow' | 'fast'>('normal');
  const [selectedCard, setSelectedCard] = useState<ScanRecord | null>(null);

  const durationMap = {
    slow: '45s',
    normal: '28s',
    fast: '16s'
  };

  const currentDuration = durationMap[speed];

  // Up column and Down column items duplicated for seamless infinite scroll
  const upItems = [...UP_COLUMN_RECORDS, ...UP_COLUMN_RECORDS];
  const downItems = [...DOWN_COLUMN_RECORDS, ...DOWN_COLUMN_RECORDS];

  // If reversed: column 1 scrolls down, column 2 scrolls up
  const col1Class = reversed ? 'animate-scroll-down' : 'animate-scroll-up';
  const col2Class = reversed ? 'animate-scroll-up' : 'animate-scroll-down';

  return (
    <div className="w-full">
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-1">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Document Stream</span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Simultaneous bi-directional scroll showcase
          </span>
        </div>

        {/* Interactive Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Pause / Resume */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors shadow-xs cursor-pointer"
            title={isPlaying ? 'Pause scroll animation' : 'Resume scroll animation'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-slate-600" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Reverse Direction */}
          <button
            onClick={() => setReversed(!reversed)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors shadow-xs cursor-pointer"
            title="Invert scrolling directions"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-600" />
            <span>{reversed ? 'Inverted' : 'Standard'} Direction</span>
          </button>

          {/* Speed Presets */}
          <div className="inline-flex items-center p-0.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-600">
            {(['slow', 'normal', 'fast'] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => setSpeed(spd)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all cursor-pointer ${
                  speed === spd
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {spd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dual Column Container with Vertical Fade Mask */}
      <div 
        className="relative h-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6 mask-gradient-y select-none"
        style={{
          ['--scroll-duration' as string]: currentDuration
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {/* Column 1: Scrolls Up (or Down if reversed) */}
          <div className="relative overflow-hidden h-full">
            <div className="absolute top-2 left-2 z-10 text-[10px] uppercase font-mono tracking-wider font-semibold bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 shadow-xs flex items-center space-x-1.5">
              <span className={`inline-block transition-transform duration-300 ${reversed ? 'rotate-180' : ''}`}>
                ▲
              </span>
              <span>{reversed ? 'Stream B (Scrolling Down)' : 'Stream A (Scrolling Up)'}</span>
            </div>

            <div
              className={`flex flex-col space-y-4 pt-10 ${col1Class} ${!isPlaying ? 'is-paused' : ''}`}
              style={{
                animationDuration: currentDuration
              }}
            >
              {upItems.map((item, idx) => {
                const badge = getRiskBadge(item.similarity, item.riskLevel);
                return (
                  <div
                    key={`up-${item.id}-${idx}`}
                    onClick={() => setSelectedCard(item)}
                    className="group bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div className="flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="text-[11px] font-medium text-slate-500 truncate max-w-[180px]">
                          {item.category}
                        </span>
                      </div>
                      <div className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        <span>{badge.text}</span>
                      </div>
                    </div>

                    <h4 className="font-medium text-sm text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-3 leading-snug">
                      {item.title}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Search className="w-3 h-3 text-slate-400" />
                          <span>{item.matchedSources} sources</span>
                        </span>
                        <span>•</span>
                        <span>{item.wordCount.toLocaleString()} words</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.timeAgo}</span>
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 truncate">{item.institution}</span>
                      <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                        {item.statusBadge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Scrolls Down (or Up if reversed) */}
          <div className="relative overflow-hidden h-full hidden md:block">
            <div className="absolute top-2 left-2 z-10 text-[10px] uppercase font-mono tracking-wider font-semibold bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 shadow-xs flex items-center space-x-1.5">
              <span className={`inline-block transition-transform duration-300 ${reversed ? 'rotate-180' : ''}`}>
                ▼
              </span>
              <span>{reversed ? 'Stream A (Scrolling Up)' : 'Stream B (Scrolling Down)'}</span>
            </div>

            <div
              className={`flex flex-col space-y-4 pt-10 ${col2Class} ${!isPlaying ? 'is-paused' : ''}`}
              style={{
                animationDuration: currentDuration
              }}
            >
              {downItems.map((item, idx) => {
                const badge = getRiskBadge(item.similarity, item.riskLevel);
                return (
                  <div
                    key={`down-${item.id}-${idx}`}
                    onClick={() => setSelectedCard(item)}
                    className="group bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div className="flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="text-[11px] font-medium text-slate-500 truncate max-w-[180px]">
                          {item.category}
                        </span>
                      </div>
                      <div className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        <span>{badge.text}</span>
                      </div>
                    </div>

                    <h4 className="font-medium text-sm text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-3 leading-snug">
                      {item.title}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Search className="w-3 h-3 text-slate-400" />
                          <span>{item.matchedSources} sources</span>
                        </span>
                        <span>•</span>
                        <span>{item.wordCount.toLocaleString()} words</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.timeAgo}</span>
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 truncate">{item.institution}</span>
                      <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                        {item.statusBadge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Card Inspection Modal (if clicked) */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-slide-from-up">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-slate-500">{selectedCard.institution}</span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mt-0.5">
                  {selectedCard.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Calculated Similarity</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {selectedCard.similarity}%
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Verification Status</span>
                <span className="text-sm font-semibold text-emerald-700">
                  {selectedCard.statusBadge}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Word Count</span>
                <span className="text-sm font-medium text-slate-800 font-mono">
                  {selectedCard.wordCount.toLocaleString()} words
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Academic Discipline</span>
                <span className="text-xs font-medium text-slate-800 truncate block">
                  {selectedCard.category}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This document was parsed against academic reference corpora, indexed scholarly repositories, and student submission registries using n-gram shingle matching and lexical sequence verification.
            </p>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                onClick={() => setSelectedCard(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
