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
  GraduationCap
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const showcaseSlides = [
    {
      title: 'Passage Heatmap & Real-Time Scoring',
      subtitle: 'Sentence-by-Sentence Similarity Detection',
      description:
        'Our engine reads your document like a reviewer would—splitting your paper into distinct sentences, tokenizing phrases, and highlighting overlapping passages so you can see exactly which parts matched.',
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
        'Whenever a sentence matches an existing paper, thesis, or corpus document, you get the exact matching passage side-by-side with source metadata, author credentials, and publication dates.',
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
        'Rather than leaving you with an ambiguous percentage, each report breaks down whether flagged content needs quotation marks, an updated in-text citation, or comprehensive paraphrasing in your own words.',
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
      a: 'Most universities and academic institutions look for an overall similarity score below 15% to 20%, excluding bibliography and common terminology. However, any verbatim passage longer than 7–10 words should always be properly enclosed in quotation marks and cited.'
    },
    {
      q: 'Will checking my paper add it to a public database?',
      a: 'No. Your documents remain strictly private to your student account. They are analyzed against our reference corpus and never made publicly viewable or searchable by third parties.'
    },
    {
      q: 'What file formats can I upload?',
      a: 'We support PDF (.pdf), Microsoft Word (.docx), and plain text (.txt) documents up to 10MB in size. You can also paste raw text directly into the dashboard for an instant check.'
    },
    {
      q: 'How does the similarity engine detect paraphrasing?',
      a: 'Our comparison engine uses a combination of sliding n-gram shingles, token sequence comparison, and semantic vector overlap. Even if minor words or sentence structures are rearranged, closely derived text is accurately highlighted.'
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-medium mb-6 border border-slate-200/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle"></span>
            <span>Dedicated Student Academic Integrity Portal</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 text-balance leading-[1.15]">
            Originality and similarity <br className="hidden sm:inline" />
            checking for your papers
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload your assignments, essays, or research documents to get a clear, passage-by-passage similarity report in seconds. Verify your citations before submitting to professors.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {user ? (
              <>
                <Link
                  href="/upload"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm flex items-center justify-center space-x-2 transition-colors shadow-sm"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Check a Document</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-sm flex items-center justify-center transition-colors"
                >
                  <span>Go to Dashboard</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm flex items-center justify-center space-x-2 transition-colors shadow-sm"
                >
                  <span>Student Sign Up</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-sm flex items-center justify-center transition-colors"
                >
                  <span>Student Sign In</span>
                </Link>
              </>
            )}
          </div>
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

      {/* Main Requirement: Check. Compare. Improve. */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Check. Compare. Improve.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
              An intelligent plagiarism-checking portal designed to help students verify the originality of their academic work. Upload your document, analyze its content for similar or matching passages, explore detected sources, and understand where your work may need improvement—all from one simple dashboard.
            </p>
          </div>

          {/* 4 Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-slate-900">Upload Documents</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload your academic documents quickly and securely.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-slate-900">Similarity Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Detect matching and closely similar content.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-slate-900">Detailed Reports</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Review similarity percentages, matched passages, and sources.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-slate-900">Improve Originality</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Identify areas that may need better citation, paraphrasing, or original writing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sliding Showcase Carousel */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Interactive Preview
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Experience the Originality Analysis
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Slide through how our inspection tools reveal insights about your writing.
            </p>
          </div>

          {/* Sliding Card Container */}
          <div className="relative bg-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-xl overflow-hidden">
            {/* Header / Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
              <div className="flex items-center space-x-2">
                {showcaseSlides.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-400 px-1">
                  {activeSlide + 1} / {showcaseSlides.length}
                </span>
                <button
                  onClick={handleNextSlide}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  aria-label="Next slide"
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
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeSlide === idx ? 'w-8 bg-white' : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">Auto-advancing every 5 seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* Natural & Detailed Deep-Dive Explanation */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              How the Originality Engine Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              A transparent look at how your documents are analyzed, sentence by sentence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-xs font-mono">
                01
              </div>
              <h3 className="font-semibold text-base text-slate-900">Text Extraction & Clean Structure</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether you drop in a complex PDF with multiple columns, a Word document, or raw text, the parser strips metadata noise while preserving paragraph breaks, sentence delimiters, and grammatical flow.
              </p>
            </div>

            <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-xs font-mono">
                02
              </div>
              <h3 className="font-semibold text-base text-slate-900">Sliding-Window N-Gram Matching</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Documents are split into continuous sequences of words (shingles). By comparing overlapping word sequences against reference documents, verbatim sentences and closely rearranged phrasing are reliably surfaced.
              </p>
            </div>

            <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-xs font-mono">
                03
              </div>
              <h3 className="font-semibold text-base text-slate-900">Corpus Comparison & Scored Risk</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your paper is checked against academic papers, standard research references, and corpus materials. The engine computes mathematical similarity ratios, categorizing risk into Low, Moderate, High, or Very High.
              </p>
            </div>

            <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-xs font-mono">
                04
              </div>
              <h3 className="font-semibold text-base text-slate-900">Actionable Feedback for Revisions</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The final report doesn’t just show numbers; it guides you on where to insert quotation marks, synthesize complex theories in your own style, or provide standard citations before final submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student FAQ Accordion */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Questions & Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Everything you need to know about checking your academic papers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-medium text-slate-900 hover:bg-slate-100/60 transition-colors"
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
        </div>
      </section>

      {/* Security & Simplicity Call to Action Banner */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="space-y-3 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold">
                Ready to review your document?
              </h3>
              <p className="text-sm text-slate-300 max-w-lg">
                Create a student account or sign in with your email to start checking submissions with full privacy.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href={user ? '/upload' : '/register'}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-medium text-sm transition-colors shadow-sm"
              >
                <span>{user ? 'Upload Document' : 'Create Student Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
