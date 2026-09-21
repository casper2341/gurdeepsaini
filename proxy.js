import { NextResponse } from 'next/server';

// travel.gurdeepsaini.com is served from app/travel/* in this same deployment.
// On the travel host every path is rewritten under /travel (the URL stays clean);
// on any other host /travel/* redirects to the subdomain so there's one copy.
// (Next 16 renamed middleware.js → proxy.js; it always runs on the Node runtime.)

// Read from the environment rather than pinned, so a preview deployment doesn't end up with the
// data layer generating URLs for one host while the proxy only rewrites for another. process.env
// directly, not the travel.js export — that module runs its validation loop on import and has no
// business in the middleware bundle.
const TRAVEL_HOST = new URL(
  process.env.NEXT_PUBLIC_TRAVEL_URL || 'https://travel.gurdeepsaini.com',
).host;

// travel.localhost resolves to 127.0.0.1 in Chrome/Firefox, so dev mirrors prod. Gated on NODE_ENV
// so the branch is dead-code-eliminated from the production bundle: today Vercel won't route an
// unrecognised Host here, but "the code has no such branch" beats "the platform filters it".
const DEV = process.env.NODE_ENV !== 'production';
const isTravelHost = (hostname) => hostname === TRAVEL_HOST || (DEV && hostname === 'travel.localhost');

const isTravelPath = (pathname) => pathname === '/travel' || pathname.startsWith('/travel/');

export function proxy(req) {
  const [hostname, port] = (req.headers.get('host') || '').split(':');
  const { pathname, search } = req.nextUrl;

  // The main host only needs this for /travel/* (the 308); everything else falls straight through.
  // The invocation still happens — matcher can't branch on Host — but it ends in two comparisons
  // rather than the work below.
  if (!isTravelHost(hostname) && !isTravelPath(pathname)) return NextResponse.next();

  if (isTravelHost(hostname)) {
    if (isTravelPath(pathname)) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = pathname === '/' ? '/travel' : `/travel${pathname}`;
    return NextResponse.rewrite(url);
  }

  const origin =
    hostname === 'localhost' ? `http://travel.localhost${port ? `:${port}` : ''}` : `https://${TRAVEL_HOST}`;
  // new URL() reads a leading '//' as scheme-relative, so '/travel//evil.com' would resolve to
  // https://evil.com/. Next normalises repeated slashes before this runs, which is why that isn't
  // reachable today — but collapse them here anyway, so the guarantee comes from this file rather
  // than from a framework behaviour that has changed across major versions before.
  const rest = pathname.slice('/travel'.length) || '/';
  const target = new URL(`/${rest.replace(/^[/\\]+/, '')}`, origin);
  target.search = search;
  return NextResponse.redirect(target, 308);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
    // the pattern above skips anything with a dot, so list these explicitly
    '/sitemap.xml',
    '/robots.txt',
  ],
};
