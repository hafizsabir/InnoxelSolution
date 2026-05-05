import { NextResponse, type NextRequest } from 'next/server';
import { verifyAppToken, APP_TOKEN_COOKIE } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(APP_TOKEN_COOKIE)?.value;

  // No token → redirect to login
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Invalid / expired token → redirect to login
  const payload = await verifyAppToken(token);
  if (!payload) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    url.searchParams.set('error', 'session_expired');
    return NextResponse.redirect(url);
  }

  // Valid token but not an admin → redirect to login with forbidden message
  if (payload.role !== 'admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('error', 'forbidden');
    return NextResponse.redirect(url);
  }

  // Admin ✓ — allow through
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
