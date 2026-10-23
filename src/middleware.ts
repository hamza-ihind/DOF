import { NextResponse, type NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && request.nextUrl.pathname !== '/api/uploadthing') {
    const origin = request.headers.get('origin');
    const expected = process.env.APP_URL ? new URL(process.env.APP_URL).origin : request.nextUrl.origin;
    if ((origin && origin !== expected) || request.headers.get('sec-fetch-site') === 'cross-site') return NextResponse.json({ error: 'Cross-site request rejected' }, { status: 403 });
  }
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : '') + "; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; font-src 'self' data:; connect-src 'self' https: wss: ws:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (/^\/(api|admin|account)/.test(request.nextUrl.pathname)) response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };