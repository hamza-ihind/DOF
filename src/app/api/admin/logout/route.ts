import { NextResponse } from 'next/server';
import { logout } from '@/lib/auth';
import { sameOrigin, failure } from '@/lib/security';
export async function POST(request: Request) {
  try { sameOrigin(request); await logout(); return NextResponse.json({ success: true }); }
  catch (error) { return failure(error); }
}
