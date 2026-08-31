import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  const corpusDocs = db.getDocuments({ isCorpus: true });
  return NextResponse.json({ success: true, corpus: corpusDocs });
}

export async function POST(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  try {
    const { title, author, text } = await req.json();
    if (!title || !text || text.trim().length < 20) {
      return NextResponse.json(
        { error: 'Title and content text (minimum 20 characters) are required.' },
        { status: 400 }
      );
    }

    const cleanText = text.trim();
    const words = cleanText.split(/\s+/).filter(Boolean);
    const sentences = cleanText.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);

    const doc = db.createDocument({
      user_id: user.id,
      title: title.trim(),
      filename: `${title.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`,
      file_path: `corpus://admin-${Date.now()}`,
      file_type: 'txt',
      file_size: Buffer.byteLength(cleanText, 'utf-8'),
      extracted_text: cleanText,
      word_count: words.length,
      char_count: cleanText.length,
      sentence_count: sentences.length,
      is_corpus_item: true,
      author_name: author?.trim() || 'Academic Library Reference',
    });

    return NextResponse.json({
      success: true,
      message: 'Reference paper added to comparison corpus successfully',
      document: doc,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to add corpus document' }, { status: 500 });
  }
}
