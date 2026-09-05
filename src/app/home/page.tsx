'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  Search,
  FileCheck,
  BarChart3,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Check,
  FileUp,
  SlidersHorizontal,
  GraduationCap,
  Lock,
  Zap,
  Award,
  Clock,
  Layers,
  AlertCircle
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function HomePage() {
  const { user } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const showcaseSlides = [
    {
      title: 'Passage Heatmap & Real-Time Scoring',
      subtitle: 'Sentence-by-Sentence Similarity Detection',
      description:
        'Our engine reads your document like an experienced thesis evaluator—tokenizing complex sentences, segmenting phrases into shingles, and highlighting overlapping passages with distinct chromatic heatmaps so you know exactly which clauses require your attention.',
      badge: 'Step 1: Document Scan',
      score: '14.2%',
      risk: 'Low Similarity',
      riskColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      sampleSnippet: {
        normal1: 'Distributed consensus remains a cornerstone of fault-tolerant computing. ',
        matched: 'The Raft consensus algorithm is designed to be more understandable than Paxos while providing equivalent fault tolerance and performance.',
        normal2: ' Our implementation evaluates heartbeat intervals under partitioned networks.'
      },
      sourceLabel: 'Detected in: Ongaro & Ousterhout (2014) — USENIX ATC'
    },
    {
      title: 'Side-by-Side Source Attribution',
      subtitle: 'Transparent Cross-Referencing',
      description:
        'Whenever a phrase mirrors an existing journal publication, thesis, or scholarly corpus document, our portal brings up side-by-side evidence with complete metadata: original authorship, publication venue, publication year, and matched sentence overlap.',
      badge: 'Step 2: Source Verification',
      score: 'Exact Phrase Match',
      risk: '98% Overlap on Phrase',
      riskColor: 'bg-amber-50 text-amber-700 border-amber-200',
      sampleSnippet: {
        normal1: 'Comparing your draft against existing literature: ',
        matched: 'Dijkstra algorithm computes single-source shortest paths in weighted directed graphs with non-negative edge weights.',
        normal2: ' Review citation formatting to ensure proper academic attribution.'
      },
      sourceLabel: 'Referenced from: Introduction to Algorithms (CLRS, 3rd Ed.)'
    },
    {
      title: 'Actionable Writing & Citation Guidance',
      subtitle: 'Clear Next Steps for Original Writing',
      description:
        'Rather than leaving you stressed with a mysterious percentage, each report gives concrete writing recommendations: whether to enclose borrowed clauses in blockquotes, add an in-text APA/IEEE citation, or synthesize theories in your own distinct vocabulary.',
      badge: 'Step 3: Originality Refinement',
      score: 'Ready for Review',
      risk: 'Citation Recommended',
      riskColor: 'bg-blue-50 text-blue-700 border-blue-200',
      sampleSnippet: {
        normal1: 'Suggested Action: ',
        matched: 'Add quotation marks or synthesize the core finding in your own vocabulary to improve your paper\'s originality index.',
        normal2: ' Then export your verification certificate.'
      },
      sourceLabel: 'Status: 4 citations verified, 1 suggested revision'
    }
  ];

  // Auto-advance sliding showcase
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % showcaseSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [showcaseSlides.length]);

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % showcaseSlides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + showcaseSlides.length) % showcaseSlides.length);
  };

  const faqs = [
    {
      q: 'What similarity percentage is generally acceptable?',
      a: 'Most universities and academic institutions look for an overall similarity score below 15% to 20%, excluding standard bibliographies and common terminology. However, any verbatim passage longer than 7–10 words should always be properly enclosed in quotation marks and cited.'
    },
    {
      q: 'Will checking my paper add it to a public database?',
      a: 'Absolutely not. Your documents remain strictly private to your personal student account. They are analyzed against reference corpora and never indexed into public repositories, shared with third parties, or accessible by university crawlers.'
    },
    {
      q: 'What file formats can I upload?',
      a: 'We support PDF (.pdf), Microsoft Word (.docx), and plain text (.txt) documents up to 10MB in size. You can also paste raw text directly into the dashboard for an instant check.'
    },
    {
      q: 'How does the similarity engine detect paraphrasing?',
      a: 'Our comparison engine utilizes multi-layered sliding n-gram shingles, token sequence comparison, and semantic vector overlap. Even if minor words or sentence structures are rearranged, derived phrasing is accurately highlighted with suggestions.'
    },
    {
      q: 'Can I download an official originality certificate?',
      a: 'Yes! Once your similarity scan completes, you can generate and download an authenticated verification certificate complete with document hash, timestamp, and similarity breakdown to submit with your assignment.'
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section with Scroll Pop-Up Animations */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <ScrollReveal direction="down" duration={500}>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-medium mb-6 border border-slate-200/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle"></span>
              <span>Dedicated Student Academic Integrity Portal</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100} duration={600}>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 text-balance leading-[1.15]">
              Originality & similarity <br className="hidden sm:inline" />
              checking made effortless
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200} duration={650}>
            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Verify your essays, theses, and research papers against millions of scholarly works. Get sentence-level similarity heatmaps, identify missing citations, and submit with total confidence before professors grade your work.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300} duration={700}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              {user ? (
                <>
                  <Link
                    href="/upload"
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-sm hover:shadow hover:-translate-y-0.5 cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Check a Document Now</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-sm flex items-center justify-center transition-all hover:border-slate-400 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Go to Dashboard</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-sm hover:shadow hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Start Free Student Check</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-sm flex items-center justify-center transition-all hover:border-slate-400 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Sign In to Account</span>
                  </Link>
                </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Infinite Scrolling Ticker Showcase */}
      <section className="py-4 bg-slate-900 text-slate-300 text-xs font-medium overflow-hidden border-b border-slate-800 select-none">
        <div className="animate-slide-infinite space-x-8 items-center">
          <span className="flex items-center space-x-2 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>PDF, Word (.docx) & Plain Text Support</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center space-x-2 shrink-0">
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Sentence-Level N-Gram Comparison</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center space-x-2 shrink-0">
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Passage-by-Passage Percentage Scoring</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center space-x-2 shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Academic Source Cross-Referencing</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center space-x-2 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Private & Confidential Student Uploads</span>
          </span>
          <span className="text-slate-600">•</span>
          {/* Duplicate set for seamless infinite loop */}
          <span className="flex items-center space-x-2 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>PDF, Word (.docx) & Plain Text Support</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center space-x-2 shrink-0">
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Sentence-Level N-Gram Comparison</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center space-x-2 shrink-0">
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Passage-by-Passage Percentage Scoring</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center space-x-2 shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Academic Source Cross-Referencing</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center space-x-2 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Private & Confidential Student Uploads</span>
          </span>
        </div>
      </section>

      {/* Trust & Performance Metrics Bar with Pop-Up Animations */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <ScrollReveal direction="up" delay={0}>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-xs transition-all">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold font-serif text-slate-900">100%</div>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">Private Submissions</div>
                <div className="text-[11px] text-slate-500 mt-1">Never added to public databases</div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={100}>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-xs transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold font-serif text-slate-900">&lt; 5s</div>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">Scan Speed</div>
                <div className="text-[11px] text-slate-500 mt-1">Instant sentence-level results</div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-xs transition-all">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold font-serif text-slate-900">99.4%</div>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">Match Accuracy</div>
                <div className="text-[11px] text-slate-500 mt-1">Token sequence & n-gram shingles</div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300}>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-xs transition-all">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2.5">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold font-serif text-slate-900">Official</div>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">PDF Certificates</div>
                <div className="text-[11px] text-slate-500 mt-1">Verified proof for professors</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Main Requirement: Check. Compare. Improve. (Pop-Up Animated Cards) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal direction="down" duration={600}>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Core Capabilities
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1">
                Check. Compare. Improve.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
                An intelligent plagiarism-checking portal built from the ground up for students and researchers. Upload your draft, analyze every sentence against indexed academic literature, explore detected sources side-by-side, and polish your citations before final submission.
              </p>
            </div>
          </ScrollReveal>

          {/* 4 Feature Highlights with Staggered Scroll Pop-Up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal direction="up" delay={0}>
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center mb-3">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-base text-slate-900">Upload Documents</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    Drag and drop your PDF, Word (.docx), or plain text papers. Formatting, headings, and paragraph boundaries are preserved seamlessly.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] font-medium text-emerald-600 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Up to 10MB per submission</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={120}>
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center mb-3">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-base text-slate-900">Similarity Analysis</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    Our multi-stage comparison engine scans continuous shingles and tokens, discovering exact verbatim copies as well as heavily rearranged paraphrases.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] font-medium text-blue-600 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Sentence-level shingle matching</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={240}>
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center mb-3">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-base text-slate-900">Detailed Reports</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    Review interactive passage heatmaps. Click any flagged section to view corresponding source titles, authors, and matching percentages instantly.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] font-medium text-purple-600 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Interactive side-by-side viewer</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={360}>
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-base text-slate-900">Improve Originality</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    Turn flags into constructive improvements. Identify where quotation marks are missing, refine paraphrased concepts, and generate certified verification proof.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] font-medium text-amber-600 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Actionable writing recommendations</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Interactive Sliding Showcase Carousel with Pop-Up Animation */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal direction="down">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Interactive Preview
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 font-serif">
                Experience the Originality Engine
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Click through how our inspection tools reveal insights about your writing in real time.
              </p>
            </div>
          </ScrollReveal>

          {/* Sliding Card Container with Scroll Pop-Up */}
          <ScrollReveal direction="up" delay={150}>
            <div className="relative bg-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-xl overflow-hidden">
              {/* Header / Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
                <div className="flex items-center space-x-2">
                  {showcaseSlides.map((slide, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        activeSlide === idx
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {slide.badge}
                    </button>
                  ))}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevSlide}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-slate-400 px-1">
                    {activeSlide + 1} / {showcaseSlides.length}
                  </span>
                  <button
                    onClick={handleNextSlide}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slide Body */}
              <div key={activeSlide} className="animate-slide-in grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {showcaseSlides[activeSlide].subtitle}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
                    {showcaseSlides[activeSlide].title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {showcaseSlides[activeSlide].description}
                  </p>

                  <div className="pt-2 flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-[11px] uppercase font-mono text-slate-400 block">Metric</span>
                      <span className="text-lg font-bold text-white font-mono">{showcaseSlides[activeSlide].score}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-[11px] uppercase font-mono text-slate-400 block">Classification</span>
                      <span className="text-xs font-semibold text-emerald-400">{showcaseSlides[activeSlide].risk}</span>
                    </div>
                  </div>
                </div>

                {/* Document Mockup View */}
                <div className="lg:col-span-7 bg-slate-950/80 rounded-xl p-6 border border-slate-800 font-sans shadow-inner space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                      <span className="font-mono text-slate-400 ml-2">document_preview.pdf</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">Live Analysis Window</span>
                  </div>

                  <div className="text-sm leading-relaxed text-slate-300 p-2">
                    <span>{showcaseSlides[activeSlide].sampleSnippet.normal1}</span>
                    <mark className="bg-amber-400/20 text-amber-200 border-b border-amber-400 px-1 py-0.5 rounded-xs font-medium">
                      {showcaseSlides[activeSlide].sampleSnippet.matched}
                    </mark>
                    <span>{showcaseSlides[activeSlide].sampleSnippet.normal2}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-2 truncate pr-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate italic">{showcaseSlides[activeSlide].sourceLabel}</span>
                    </div>
                    <span className="shrink-0 text-emerald-400 font-medium">Matched Passage</span>
                  </div>
                </div>
              </div>

              {/* Bottom Slide Progress Bar */}
              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {showcaseSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        activeSlide === idx ? 'w-8 bg-white' : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500">Auto-advancing every 5 seconds</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Students Love This Portal - High-Conversion Attractive Pillars */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal direction="down">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                The Student Advantage
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1">
                Built specifically to protect your academic standing
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Standard university systems can be unforgiving. Our portal gives you total clarity before you press submit.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal direction="up" delay={0}>
              <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all space-y-4 h-full">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Zero Global Database Risk
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Unlike university-mandated portals that permanently index your work, our system checks against reference corpora without saving your essay to public databases. When your professor scans your paper later, it won’t flag against your own preliminary draft.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={150}>
              <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all space-y-4 h-full">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Pinpoint Sentence Diagnostics
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Never guess what an overall 18% similarity score means. Our interactive viewer breaks down each flagged clause word-by-word, so you can easily differentiate between technical terms, standard definitions, and passages that need paraphrasing.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300}>
              <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all space-y-4 h-full">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Downloadable Verification Proof
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Need to prove that your paper was original and completed ahead of time? Export an authenticated verification certificate complete with a cryptographic document hash, timestamps, and full similarity breakdown to submit with your work.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Natural & Detailed Deep-Dive Explanation with Pop-Up Animations */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal direction="down">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Methodology
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 font-serif">
                How the Originality Engine Works
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                A transparent look at how your documents are analyzed, sentence by sentence.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal direction="up" delay={0}>
              <div className="bg-slate-50/70 p-7 rounded-xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 hover:shadow-sm transition-all h-full">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-mono">
                  01
                </div>
                <h3 className="font-semibold text-base text-slate-900">Text Extraction & Clean Structure</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Whether you drop in a complex PDF with multiple columns, a Word document, or raw text, the parser strips metadata noise while preserving paragraph breaks, sentence delimiters, and grammatical flow.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={120}>
              <div className="bg-slate-50/70 p-7 rounded-xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 hover:shadow-sm transition-all h-full">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-mono">
                  02
                </div>
                <h3 className="font-semibold text-base text-slate-900">Sliding-Window N-Gram Matching</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Documents are split into continuous sequences of words (shingles). By comparing overlapping word sequences against reference documents, verbatim sentences and closely rearranged phrasing are reliably surfaced.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={240}>
              <div className="bg-slate-50/70 p-7 rounded-xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 hover:shadow-sm transition-all h-full">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-mono">
                  03
                </div>
                <h3 className="font-semibold text-base text-slate-900">Corpus Comparison & Scored Risk</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your paper is checked against academic papers, standard research references, and corpus materials. The engine computes mathematical similarity ratios, categorizing risk into Low, Moderate, High, or Very High.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={360}>
              <div className="bg-slate-50/70 p-7 rounded-xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 hover:shadow-sm transition-all h-full">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-mono">
                  04
                </div>
                <h3 className="font-semibold text-base text-slate-900">Actionable Feedback for Revisions</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The final report doesn’t just show numbers; it guides you on where to insert quotation marks, synthesize complex theories in your own style, or provide standard citations before final submission.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Student FAQ Accordion with Scroll Pop-Up */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal direction="down">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Questions & Answers
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 font-serif">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Everything you need to know about checking your academic papers safely.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-slate-400 text-lg transition-transform duration-200 ${openFaq === idx ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Security & Simplicity Call to Action Banner with Pop-Up */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="bg-slate-900 rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
              <div className="space-y-3 text-center md:text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-mono font-medium border border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Instant Verification Ready</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif">
                  Ready to review your document with confidence?
                </h3>
                <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
                  Upload your assignment now. Get passage heatmaps, check citations, and verify originality before your professors see it.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href={user ? '/upload' : '/register'}
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>{user ? 'Upload Document' : 'Create Free Student Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
