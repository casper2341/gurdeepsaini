import { NextResponse } from 'next/server';

// travel.gurdeepsaini.com is served from app/travel/* in this same deployment.
// On the travel host every path is rewritten under /travel (the URL stays clean);
// on any other host /travel/* redirects to the subdomain so there's one copy.
// (Next 16 renamed middleware.js → proxy.js; it always runs on the Node runtime.)
const TRAVEL_HOST = 'travel.gurdeepsaini.com';

const isTravelPath = (pathname) => pathname === '/travel' || pathname.startsWith('/travel/');

export function proxy(req) {
  const [hostname, port] = (req.headers.get('host') || '').split(':');
  const { pathname, search } = req.nextUrl;

  // travel.localhost resolves to 127.0.0.1 in Chrome/Firefox, so dev mirrors prod
  if (hostname === TRAVEL_HOST || hostname === 'travel.localhost') {
    if (isTravelPath(pathname)) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = pathname === '/' ? '/travel' : `/travel${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (isTravelPath(pathname)) {
    const origin =
      hostname === 'localhost' ? `http://travel.localhost${port ? `:${port}` : ''}` : `https://${TRAVEL_HOST}`;
    const target = new URL(pathname.slice('/travel'.length) || '/', origin);
    target.search = search;
    return NextResponse.redirect(target, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
    // the pattern above skips anything with a dot, so list these explicitly
    '/sitemap.xml',
    '/robots.txt',
  ],
};
