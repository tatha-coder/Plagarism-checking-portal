import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateHighlightSegments } from '@/lib/plagiarism/highlighter';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reportId = params.id;
    const fullData = db.getFullReportData(reportId);

    if (!fullData) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Role check: Students can only view their own reports unless Admin
    if (user.role !== 'admin' && fullData.document.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden. You do not have permission to view this report.' }, { status: 403 });
    }

    // Generate highlight segments for interactive reader
    const highlightSegments = generateHighlightSegments(
      fullData.document.extracted_text,
      fullData.matches
    );

    return NextResponse.json({
      success: true,
      data: {
        ...fullData,
        highlightSegments,
      },
    });
  } catch (err: any) {
    console.error('Error fetching report:', err);
    return NextResponse.json({ error: 'Failed to retrieve report' }, { status: 500 });
  }
}
