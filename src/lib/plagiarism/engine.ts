import { db } from '../db';
import { 
  DocumentRecord, 
  PlagiarismReport, 
  SimilarityMatch, 
  RiskLevel, 
  AlgorithmBreakdown,
  SystemSettings 
} from '@/types';
import { segmentSentences, tokenize, cleanString, SentenceSpan } from './preprocessor';
import { 
  calculateCosineSimilarity, 
  calculateNgramSimilarity, 
  calculateFuzzySimilarity 
} from './algorithms';

export interface AnalysisResult {
  overallScore: number;
  riskLevel: RiskLevel;
  matchedSourcesCount: number;
  matchedPassagesCount: number;
  analysisDurationMs: number;
  algorithmBreakdown: AlgorithmBreakdown;
  matches: Omit<SimilarityMatch, 'id' | 'report_id' | 'created_at'>[];
}

export async function analyzeDocumentText(
  uploadedText: string,
  excludeDocumentId?: string,
  customSettings?: SystemSettings
): Promise<AnalysisResult> {
  const startTime = Date.now();
  const settings = customSettings || db.getSettings();

  const cleanUpload = uploadedText.trim();
  if (!cleanUpload || cleanUpload.length < 10) {
    return {
      overallScore: 0,
      riskLevel: 'low',
      matchedSourcesCount: 0,
      matchedPassagesCount: 0,
      analysisDurationMs: Date.now() - startTime,
      algorithmBreakdown: {
        exact_match_score: 0,
        ngram_jaccard_score: 0,
        tfidf_cosine_score: 0,
        sentence_overlap_score: 0,
        total_sentences: 0,
        flagged_sentences: 0,
      },
      matches: [],
    };
  }

  // 1. Fetch comparison corpus
  const allDocs = db.getDocuments();
  const corpusDocs = allDocs.filter(d => d.id !== excludeDocumentId && d.extracted_text && d.extracted_text.trim().length > 0);

  // 2. Segment uploaded document into sentences
  const uploadedSentences = segmentSentences(cleanUpload);
  const totalUploadedChars = cleanUpload.length;

  const matches: Omit<SimilarityMatch, 'id' | 'report_id' | 'created_at'>[] = [];
  const flaggedSentenceIndices = new Set<number>();
  let flaggedCharCount = 0;

  // Pre-segment corpus documents for rapid sentence matching
  const parsedCorpus = corpusDocs.map(cDoc => ({
    doc: cDoc,
    sentences: segmentSentences(cDoc.extracted_text),
    cleanFull: cleanString(cDoc.extracted_text),
  }));

  // Track max whole-document metrics
  let maxDocumentCosine = 0;
  let maxDocumentNgram = 0;

  for (const item of parsedCorpus) {
    const docCosine = calculateCosineSimilarity(cleanUpload, item.doc.extracted_text);
    const docNgram = calculateNgramSimilarity(cleanUpload, item.doc.extracted_text, settings.ngram_size || 3);
    
    if (docCosine > maxDocumentCosine) maxDocumentCosine = docCosine;
    if (docNgram > maxDocumentNgram) maxDocumentNgram = docNgram;
  }

  // 3. Sentence-level matching against corpus
  for (const uSpan of uploadedSentences) {
    let bestMatchForSentence: {
      sourceDoc: DocumentRecord;
      sourceSpan: SentenceSpan;
      score: number;
    } | null = null;

    for (const cItem of parsedCorpus) {
      // First check if the clean sentence is verbatim inside corpus text
      if (uSpan.cleanText.length >= 25 && cItem.cleanFull.includes(uSpan.cleanText)) {
        // Direct verbatim match
        // Find matching sentence in corpus
        const exactCSpan = cItem.sentences.find(s => s.cleanText.includes(uSpan.cleanText) || uSpan.cleanText.includes(s.cleanText));
        bestMatchForSentence = {
          sourceDoc: cItem.doc,
          sourceSpan: exactCSpan || {
            index: 0,
            text: uSpan.text,
            cleanText: uSpan.cleanText,
            startOffset: 0,
            endOffset: uSpan.text.length,
            tokens: uSpan.tokens,
          },
          score: 1.0,
        };
        break; // Max possible score found
      }

      for (const cSpan of cItem.sentences) {
        // Compute hybrid sentence similarity
        const ngramSim = calculateNgramSimilarity(uSpan.text, cSpan.text, 3);
        const cosineSim = calculateCosineSimilarity(uSpan.text, cSpan.text);
        const fuzzySim = calculateFuzzySimilarity(uSpan.cleanText, cSpan.cleanText);

        const compositeScore = (ngramSim * 0.4) + (cosineSim * 0.3) + (fuzzySim * 0.3);

        // Threshold for flagging an individual sentence (e.g. >= 0.45 or exact matches)
        if (compositeScore >= 0.45) {
          if (!bestMatchForSentence || compositeScore > bestMatchForSentence.score) {
            bestMatchForSentence = {
              sourceDoc: cItem.doc,
              sourceSpan: cSpan,
              score: compositeScore,
            };
          }
        }
      }
    }

    if (bestMatchForSentence) {
      flaggedSentenceIndices.add(uSpan.index);
      const spanLength = uSpan.endOffset - uSpan.startOffset;
      flaggedCharCount += spanLength;

      const simPct = Math.round(bestMatchForSentence.score * 100 * 10) / 10;
      const sourceType = bestMatchForSentence.sourceDoc.is_corpus_item
        ? 'academic_corpus'
        : 'student_submission';

      matches.push({
        source_document_id: bestMatchForSentence.sourceDoc.id,
        source_title: bestMatchForSentence.sourceDoc.title,
        source_author: bestMatchForSentence.sourceDoc.author_name || 'Academic Repository',
        source_type: sourceType,
        similarity_percentage: simPct,
        matched_text: uSpan.text,
        source_text: bestMatchForSentence.sourceSpan.text,
        start_offset: uSpan.startOffset,
        end_offset: uSpan.endOffset,
        sentence_index: uSpan.index,
        confidence_score: Math.min(1.0, Math.round(bestMatchForSentence.score * 100) / 100),
      });
    }
  }

  // 4. Calculate Final Composite Similarity Percentage
  const sentenceOverlapRatio = uploadedSentences.length > 0 
    ? (flaggedSentenceIndices.size / uploadedSentences.length) 
    : 0;

  const charOverlapRatio = totalUploadedChars > 0 
    ? Math.min(1, flaggedCharCount / totalUploadedChars) 
    : 0;

  // Weighted calculation
  const wExact = settings.exact_match_weight || 0.40;
  const wNgram = settings.ngram_weight || 0.35;
  const wCosine = settings.cosine_weight || 0.25;

  let rawScore = 0;
  if (uploadedSentences.length > 0) {
    const overlapBlend = (sentenceOverlapRatio * 0.5) + (charOverlapRatio * 0.5);
    rawScore = (overlapBlend * wExact) + (maxDocumentNgram * wNgram) + (maxDocumentCosine * wCosine);
    
    // Scale up if large blocks are matching directly
    if (charOverlapRatio > 0.6) {
      rawScore = Math.max(rawScore, charOverlapRatio * 0.95);
    }
  }

  const overallPercentage = Math.min(100, Math.max(0, Math.round(rawScore * 100 * 10) / 10));

  // Determine Risk Level based on configurable thresholds
  let riskLevel: RiskLevel = 'low';
  const thLow = settings.similarity_threshold_low || 15;
  const thMod = settings.similarity_threshold_moderate || 30;
  const thHigh = settings.similarity_threshold_high || 50;

  if (overallPercentage <= thLow) {
    riskLevel = 'low';
  } else if (overallPercentage <= thMod) {
    riskLevel = 'moderate';
  } else if (overallPercentage <= thHigh) {
    riskLevel = 'high';
  } else {
    riskLevel = 'very_high';
  }

  const uniqueSources = new Set(matches.map(m => m.source_document_id));
  const analysisDurationMs = Date.now() - startTime;

  return {
    overallScore: overallPercentage,
    riskLevel,
    matchedSourcesCount: uniqueSources.size,
    matchedPassagesCount: matches.length,
    analysisDurationMs,
    algorithmBreakdown: {
      exact_match_score: Math.round(charOverlapRatio * 100 * 10) / 10,
      ngram_jaccard_score: Math.round(maxDocumentNgram * 100 * 10) / 10,
      tfidf_cosine_score: Math.round(maxDocumentCosine * 100 * 10) / 10,
      sentence_overlap_score: Math.round(sentenceOverlapRatio * 100 * 10) / 10,
      total_sentences: uploadedSentences.length,
      flagged_sentences: flaggedSentenceIndices.size,
    },
    matches,
  };
}
