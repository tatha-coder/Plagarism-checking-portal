import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const riskLevel = searchParams.get('riskLevel') || 'all';
    const sortBy = searchParams.get('sortBy') || 'date_desc';

    // Get documents
    const documents = user.role === 'admin' 
      ? db.getDocuments({ isCorpus: false }) 
      : db.getDocuments({ userId: user.id, isCorpus: false });

    const docMap = new Map(documents.map(d => [d.id, d]));
    const reports = db.getReports();
    const users = db.getUsers();
    const userMap = new Map(users.map(u => [u.id, u]));

    const combinedList = reports
      .map(r => {
        const doc = docMap.get(r.document_id);
        if (!doc) return null;
        const owner = userMap.get(doc.user_id);
        return {
          report: r,
          document: {
            id: doc.id,
            title: doc.title,
            filename: doc.filename,
            file_type: doc.file_type,
            file_size: doc.file_size,
            word_count: doc.word_count,
            created_at: doc.created_at,
          },
          owner: owner ? {
            id: owner.id,
            name: owner.name,
            email: owner.email,
            roll_number: owner.roll_number,
            section: owner.section,
            program: owner.program,
          } : null,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    // Apply search filter
    let filtered = combinedList.filter(item => {
      if (riskLevel !== 'all' && item.report.risk_level !== riskLevel) {
        return false;
      }
      if (search) {
        const matchTitle = item.document.title.toLowerCase().includes(search);
        const matchFilename = item.document.filename.toLowerCase().includes(search);
        const matchOwner = item.owner?.name.toLowerCase().includes(search) || item.owner?.roll_number?.toLowerCase().includes(search);
        return matchTitle || matchFilename || !!matchOwner;
      }
      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date_asc') {
        return new Date(a.report.created_at).getTime() - new Date(b.report.created_at).getTime();
      }
      if (sortBy === 'score_desc') {
        return b.report.overall_score - a.report.overall_score;
      }
      if (sortBy === 'score_asc') {
        return a.report.overall_score - b.report.overall_score;
      }
      // default: date_desc
      return new Date(b.report.created_at).getTime() - new Date(a.report.created_at).getTime();
    });

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (err: any) {
    console.error('Error listing reports:', err);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
