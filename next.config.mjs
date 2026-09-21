import { fileURLToPath } from 'node:url';

// A strict, nonce-based CSP isn't available here without giving up static HTML. Next inlines the RSC
// flight payload as `self.__next_f.push(...)` — ten script tags on a state page, different on every
// page — plus the pre-hydration theme script in app/layout.js. Hashing can't work (the payload
// changes with the content) and a nonce has to be minted per request in proxy.js, which would make
// every page dynamic. So inline script stays allowed, and the directives that still do real work
// without it — base-uri, object-src, frame-ancestors, form-action — are the point of this policy.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'", // see above; revisit if nonces ever become free
  "style-src 'self' 'unsafe-inline'", // React writes inline style attributes
  "img-src 'self' data: blob:",
  "font-src 'self'", // system fonts only — nothing is fetched
  "connect-src 'self'",
  "form-action 'none'", // there are no forms anywhere in the app
  "frame-ancestors 'none'", // clickjacking
  "base-uri 'self'", // blocks <base> injection repointing every relative URL
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

// The CSP ships report-only until it's been watched on a real browser across both maps, the theme
// toggle and the Web Audio click — those are the three things most likely to trip it. Flip this to
// true once the console is clean; nothing else needs to change.
const CSP_ENFORCED = false;

const securityHeaders = [
  {
    key: CSP_ENFORCED ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only',
    value: csp,
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  // includeSubDomains covers travel.gurdeepsaini.com, which is HTTPS on the same deployment.
  // Only submit to the preload list once no subdomain will ever need plain HTTP.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Stated explicitly because a stray package-lock.json above the repo makes Turbopack walk up
  // looking for a workspace root, and the inferred root is then ambiguous.
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },

  // lets `next dev` serve the travel site at travel.localhost:3000 (see proxy.js)
  allowedDevOrigins: ['travel.localhost'],

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
