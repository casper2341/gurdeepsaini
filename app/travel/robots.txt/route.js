import { travelUrl } from '../../data/travel';

// robots.js is only honoured at the app root, so the travel host's robots.txt is a
// plain route handler; proxy.js rewrites travel.gurdeepsaini.com/robots.txt here.
export const dynamic = 'force-static';

export function GET() {
  const body = `User-Agent: *\nAllow: /\n\nHost: ${travelUrl}\nSitemap: ${travelUrl}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
