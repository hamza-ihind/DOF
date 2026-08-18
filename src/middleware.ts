import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'dof_admin_session_token';
const ADMIN_SESSION_SECRET = 'dof_secure_admin_auth_token_2026_biougra';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect admin sub-routes (e.g. /admin/events/new, /admin/events/1/edit)
  if (path.startsWith('/admin/events')) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (token !== ADMIN_SESSION_SECRET) {
      const loginUrl = new URL('/admin', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/events/:path*'],
};
