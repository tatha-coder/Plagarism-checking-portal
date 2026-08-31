import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const document = db.getDocumentById(params.id);
  if (!document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  if (user.role !== 'admin' && document.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ success: true, document });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const document = db.getDocumentById(params.id);
  if (!document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  const settings = db.getSettings();
  if (user.role !== 'admin') {
    if (document.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!settings.allow_student_delete) {
      return NextResponse.json({ error: 'Document deletion is restricted by administrator.' }, { status: 403 });
    }
  }

  const deleted = db.deleteDocument(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Document and analysis report deleted successfully' });
}
