import { NextResponse } from 'next/server';

const RATE_LIMIT_MAP = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 30;

function getClientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';
}

function isRateLimited(ip) {
  const now = Date.now();
  const record = RATE_LIMIT_MAP.get(ip);
  if (!record || now - record.start > RATE_LIMIT_WINDOW) {
    RATE_LIMIT_MAP.set(ip, { start: now, count: 1 });
    return false;
  }
  record.count++;
  return record.count > RATE_LIMIT_MAX;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (request.method === 'POST') {
      const origin = request.headers.get('origin');
      const host = request.headers.get('host');
      if (origin && host && !origin.includes(host)) {
        return NextResponse.json(
          { error: 'Invalid origin' },
          { status: 403 }
        );
      }
    }

    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    return response;
  }

  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.svg|images/).*)'],
};
