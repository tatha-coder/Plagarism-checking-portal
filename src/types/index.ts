export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  roll_number?: string;
  section?: string;
  program?: string;
  created_at: string;
  updated_at: string;
}

export type SafeUser = Omit<User, 'password_hash'>;

export interface DocumentRecord {
  id: string;
  user_id: string;
  title: string;
  filename: string;
  file_path: string;
  file_type: 'pdf' | 'docx' | 'txt' | 'raw';
  file_size: number;
  extracted_text: string;
  word_count: number;
  char_count: number;
  sentence_count: number;
  is_corpus_item: boolean; // true if it's a baseline reference corpus document
  author_name?: string;
  created_at: string;
  updated_at: string;
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'very_high';

export interface AlgorithmBreakdown {
  exact_match_score: number;
  ngram_jaccard_score: number;
  tfidf_cosine_score: number;
  sentence_overlap_score: number;
  total_sentences: number;
  flagged_sentences: number;
}

export interface PlagiarismReport {
  id: string;
  document_id: string;
  overall_score: number; // 0 to 100
  risk_level: RiskLevel;
  matched_sources_count: number;
  matched_passages_count: number;
  analysis_duration_ms: number;
  algorithm_breakdown: AlgorithmBreakdown;
  created_at: string;
}

export interface SimilarityMatch {
  id: string;
  report_id: string;
  source_document_id: string;
  source_title: string;
  source_author: string;
  source_type: 'academic_corpus' | 'student_submission' | 'external_reference';
  similarity_percentage: number;
  matched_text: string;
  source_text: string;
  start_offset: number; // Character index in uploaded document
  end_offset: number;
  sentence_index?: number;
  confidence_score: number;
  created_at: string;
}

export interface HighlightSegment {
  start: number;
  end: number;
  text: string;
  isHighlighted: boolean;
  matchId?: string;
  sourceTitle?: string;
  sourceType?: string;
  similarity?: number;
}

export interface FullReportData {
  report: PlagiarismReport;
  document: DocumentRecord;
  student: SafeUser;
  matches: SimilarityMatch[];
  sourcesSummary: {
    source_document_id: string;
    source_title: string;
    source_author: string;
    source_type: string;
    matched_percentage: number;
    match_count: number;
  }[];
}

export interface SystemSettings {
  id: string;
  ngram_size: number;
  similarity_threshold_low: number;
  similarity_threshold_moderate: number;
  similarity_threshold_high: number;
  min_passage_length: number;
  exact_match_weight: number;
  ngram_weight: number;
  cosine_weight: number;
  allow_student_delete: boolean;
  updated_at: string;
}
