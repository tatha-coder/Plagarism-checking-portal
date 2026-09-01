import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { SafeUser, UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secure_academic_portal_jwt_secret_key_2026_cse_ug_soet';
const TOKEN_NAME = 'portal_auth_token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export function extractToken(req: NextRequest): string | null {
  // 1. Check HTTP-only cookie
  const cookieToken = req.cookies.get(TOKEN_NAME)?.value;
  if (cookieToken) return cookieToken;

  // 2. Check Authorization Header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

export async function getAuthenticatedUserAsync(req: NextRequest): Promise<SafeUser | null> {
  const token = extractToken(req);
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      const user = db.getUserById(payload.userId);
      if (user) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          roll_number: user.roll_number,
          section: user.section,
          program: user.program,
          created_at: user.created_at,
          updated_at: user.updated_at,
        };
      }
    }
  }
  return null;
}

export function getAuthenticatedUser(req: NextRequest): SafeUser | null {
  const token = extractToken(req);
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      const user = db.getUserById(payload.userId);
      if (user) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          roll_number: user.roll_number,
          section: user.section,
          program: user.program,
          created_at: user.created_at,
          updated_at: user.updated_at,
        };
      }
    }
  }

  // When auth is removed/open: return an admin user by default so all features work seamlessly
  const adminUser = db.getUserByEmail('admin@portal.edu') || db.getUsers().find(u => u.role === 'admin') || db.getUsers()[0];
  if (adminUser) {
    return {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: 'admin',
      roll_number: adminUser.roll_number || 'FAC/CSE/2026/01',
      section: adminUser.section || 'CSE Department',
      program: adminUser.program || 'Faculty / Administration',
      created_at: adminUser.created_at,
      updated_at: adminUser.updated_at,
    };
  }

  return {
    id: 'usr_admin_001',
    name: 'Prof. Dr. Rajesh Verma',
    email: 'admin@portal.edu',
    role: 'admin',
    roll_number: 'FAC/CSE/2026/01',
    section: 'CSE Department',
    program: 'Faculty / Administration',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: TOKEN_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
