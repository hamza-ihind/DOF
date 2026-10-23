import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
export async function GET() {
  try { const session = await getSession(); return NextResponse.json({ authenticated: session?.role === 'admin' }, { status: session?.role === 'admin' ? 200 : 401 }); }
  catch { return NextResponse.json({ authenticated: false }, { status: 503 }); }
}
