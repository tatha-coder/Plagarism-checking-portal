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

    const userDocs = db.getDocuments({ userId: user.id, isCorpus: false });
    const userDocIds = new Set(userDocs.map(d => d.id));
    const allReports = db.getReports();
    const userReports = allReports.filter(r => userDocIds.has(r.document_id));

    const totalChecked = userReports.length;

    let totalSimilarity = 0;
    let highestSimilarity = 0;
    const riskCounts = {
      low: 0,
      moderate: 0,
      high: 0,
      very_high: 0,
    };

    for (const report of userReports) {
      totalSimilarity += report.overall_score;
      if (report.overall_score > highestSimilarity) {
        highestSimilarity = report.overall_score;
      }
      if (report.risk_level in riskCounts) {
        riskCounts[report.risk_level as keyof typeof riskCounts]++;
      }
    }

    const averageSimilarity = totalChecked > 0 
      ? Math.round((totalSimilarity / totalChecked) * 10) / 10 
      : 0;

    const docMap = new Map(userDocs.map(d => [d.id, d]));

    const recentSubmissions = userReports
      .map(r => {
        const doc = docMap.get(r.document_id);
        if (!doc) return null;
        return {
          reportId: r.id,
          documentId: doc.id,
          title: doc.title,
          filename: doc.filename,
          fileType: doc.file_type,
          wordCount: doc.word_count,
          overallScore: r.overall_score,
          riskLevel: r.risk_level,
          createdAt: r.created_at,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b!.createdAt).getTime() - new Date(a!.createdAt).getTime())
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      stats: {
        totalChecked,
        averageSimilarity,
        highestSimilarity,
        riskCounts,
        recentSubmissions,
      },
    });
  } catch (err: any) {
    console.error('Dashboard stats error:', err);
    return NextResponse.json({ error: 'Failed to retrieve stats' }, { status: 500 });
  }
}
