import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAuthenticatedUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { extractTextFromBuffer } from '@/lib/plagiarism/extractor';
import { analyzeDocumentText } from '@/lib/plagiarism/engine';

import os from 'os';

function resolveUploadsDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT || process.cwd().startsWith('/var/task')) {
    return path.join(os.tmpdir(), 'plagiarism_portal_uploads');
  }
  return path.join(process.cwd(), 'data', 'uploads');
}

const UPLOADS_DIR = resolveUploadsDir();

export async function POST(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const rawText = formData.get('rawText') as string | null;
    const titleInput = formData.get('title') as string | null;
    const authorNameInput = formData.get('authorName') as string | null;
    const isCorpusFlag = formData.get('isCorpus') === 'true' && user.role === 'admin';

    let title = titleInput?.trim() || 'Untitled Submission';
    let filename = 'pasted_text.txt';
    let fileType: 'pdf' | 'docx' | 'txt' | 'raw' = 'txt';
    let fileSize = 0;
    let filePath = '';
    let extractedText = '';

    if (file && typeof file === 'object' && file.name) {
      filename = file.name;
      fileSize = file.size;

      // Validate size (10 MB limit)
      if (fileSize > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size exceeds 10MB limit. Please upload a smaller document.' },
          { status: 400 }
        );
      }

      const fileExtension = filename.split('.').pop()?.toLowerCase() || '';
      if (!['pdf', 'docx', 'txt'].includes(fileExtension)) {
        return NextResponse.json(
          { error: 'Unsupported file format. Only PDF, DOCX, and TXT are supported.' },
          { status: 400 }
        );
      }

      fileType = fileExtension as 'pdf' | 'docx' | 'txt';
      if (!titleInput) {
        title = filename.replace(/\.[^/.]+$/, '');
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      // Save file to disk (safe try/catch for read-only serverless platforms)
      try {
        if (!fs.existsSync(UPLOADS_DIR)) {
          fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        }
        const safeDiskFilename = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        filePath = path.join(UPLOADS_DIR, safeDiskFilename);
        fs.writeFileSync(filePath, buffer);
      } catch (fsErr) {
        filePath = `memory://${filename}`;
      }

      // Extract text
      const extracted = await extractTextFromBuffer(buffer, fileType, filename);
      extractedText = extracted.text;
    } else if (rawText && rawText.trim().length > 0) {
      extractedText = rawText.trim();
      fileType = 'raw';
      fileSize = Buffer.byteLength(extractedText, 'utf-8');
      filePath = 'raw://direct-input';
    } else {
      return NextResponse.json(
        { error: 'Please upload a valid document or paste text to analyze.' },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.length < 15) {
      return NextResponse.json(
        { error: 'The document appears to be empty or contains insufficient extractable text (minimum 15 characters required).' },
        { status: 400 }
      );
    }

    const words = extractedText.split(/\s+/).filter(Boolean);
    const sentences = extractedText.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // 1. Create Document record
    const document = db.createDocument({
      user_id: user.id,
      title,
      filename,
      file_path: filePath,
      file_type: fileType,
      file_size: fileSize,
      extracted_text: extractedText,
      word_count: words.length,
      char_count: extractedText.length,
      sentence_count: sentences.length,
      is_corpus_item: isCorpusFlag,
      author_name: authorNameInput || user.name,
    });

    // If it's just being added to the reference corpus by an admin, no plagiarism report needed
    if (isCorpusFlag) {
      return NextResponse.json({
        success: true,
        message: 'Document added to reference corpus successfully',
        document,
      }, { status: 201 });
    }

    // 2. Run Plagiarism Engine Analysis
    const analysis = await analyzeDocumentText(extractedText, document.id);

    // 3. Save Plagiarism Report
    const report = db.createReport({
      document_id: document.id,
      overall_score: analysis.overallScore,
      risk_level: analysis.riskLevel,
      matched_sources_count: analysis.matchedSourcesCount,
      matched_passages_count: analysis.matchedPassagesCount,
      analysis_duration_ms: analysis.analysisDurationMs,
      algorithm_breakdown: analysis.algorithmBreakdown,
    });

    // 4. Save Similarity Matches
    if (analysis.matches.length > 0) {
      const matchRecords = analysis.matches.map(m => ({
        ...m,
        report_id: report.id,
      }));
      db.createMatches(matchRecords);
    }

    return NextResponse.json({
      success: true,
      message: 'Analysis completed successfully',
      documentId: document.id,
      reportId: report.id,
      overallScore: report.overall_score,
      riskLevel: report.risk_level,
    }, { status: 201 });
  } catch (err: any) {
    console.error('Upload and analysis error:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred while analyzing the document.' },
      { status: 500 }
    );
  }
}
