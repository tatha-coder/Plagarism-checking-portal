import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  const settings = db.getSettings();
  return NextResponse.json({ success: true, settings });
}

export async function PUT(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  try {
    const updates = await req.json();
    const updated = db.updateSettings(updates);
    return NextResponse.json({
      success: true,
      message: 'Algorithm and system settings updated successfully',
      settings: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
