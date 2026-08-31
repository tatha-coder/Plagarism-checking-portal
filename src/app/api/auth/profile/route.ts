import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, roll_number, section, program } = body;

    const updated = db.updateUser(user.id, {
      ...(name ? { name: name.trim() } : {}),
      ...(roll_number ? { roll_number: roll_number.trim() } : {}),
      ...(section ? { section: section.trim() } : {}),
      ...(program ? { program: program.trim() } : {}),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 400 });
    }

    const safeUser = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      roll_number: updated.roll_number,
      section: updated.section,
      program: updated.program,
    };

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Profile update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
