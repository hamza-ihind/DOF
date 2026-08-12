import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidAdminToken, ADMIN_COOKIE_NAME } from '@/lib/adminConfig';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (isValidAdminToken(token)) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
