import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const allUsers = db.getUsers();
    const students = allUsers.filter(u => u.role === 'student');
    const allDocs = db.getDocuments({ isCorpus: false });
    const corpusDocs = db.getDocuments({ isCorpus: true });
    const allReports = db.getReports();

    let totalSimilarity = 0;
    let highRiskCount = 0;
    const riskCounts = {
      low: 0,
      moderate: 0,
      high: 0,
      very_high: 0,
    };

    for (const report of allReports) {
      totalSimilarity += report.overall_score;
      if (report.risk_level === 'high' || report.risk_level === 'very_high') {
        highRiskCount++;
      }
      if (report.risk_level in riskCounts) {
        riskCounts[report.risk_level as keyof typeof riskCounts]++;
      }
    }

    const avgSimilarity = allReports.length > 0
      ? Math.round((totalSimilarity / allReports.length) * 10) / 10
      : 0;

    // Student performance breakdown
    const docMap = new Map<string, string>(); // docId -> userId
    for (const doc of allDocs) {
      docMap.set(doc.id, doc.user_id);
    }

    const userStats = students.map(student => {
      const studentDocs = allDocs.filter(d => d.user_id === student.id);
      const studentDocIds = new Set(studentDocs.map(d => d.id));
      const studentReports = allReports.filter(r => studentDocIds.has(r.document_id));

      const subCount = studentReports.length;
      const studentTotalScore = studentReports.reduce((acc, r) => acc + r.overall_score, 0);
      const studentAvgScore = subCount > 0 ? Math.round((studentTotalScore / subCount) * 10) / 10 : 0;
      const flaggedCount = studentReports.filter(r => r.risk_level === 'high' || r.risk_level === 'very_high').length;

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        roll_number: student.roll_number,
        section: student.section,
        program: student.program,
        submissionCount: subCount,
        averageSimilarity: studentAvgScore,
        flaggedSubmissions: flaggedCount,
        createdAt: student.created_at,
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: allUsers.length,
        totalStudents: students.length,
        totalSubmissions: allReports.length,
        totalCorpusDocuments: corpusDocs.length,
        averageSimilarity: avgSimilarity,
        highRiskCount,
        riskCounts,
        userStats,
      },
    });
  } catch (err: any) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'Failed to retrieve admin stats' }, { status: 500 });
  }
}
