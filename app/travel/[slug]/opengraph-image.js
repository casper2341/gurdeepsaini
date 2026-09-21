import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';
import { getPlace, places, plural, spotsByCategory, statusLine, travelUrl } from '@/data/travel';

export const alt = `A city guide from ${profile.name}'s travel map`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Without this the card is the one route in the app rendered on demand — a cold serverless
// invocation running Satori the first time a crawler or a chat app unfurls a city link. The city
// list is known at build time, so prerender them all, exactly as the page beside this does.
export function generateStaticParams() {
  return places.map((place) => ({ slug: place.slug }));
}

// Theme tokens mirrored from globals.css (light "paper" palette).
const paper = '#fdf3e3';
const ink = '#14100c';
const inkSoft = '#423a30';
const pop = '#ffcf33';
const pop2 = '#ff5d55';

export default async function Image({ params }) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) return new Response('Not found', { status: 404 });

  const categoryCount = spotsByCategory(place).length;
  const host = travelUrl.replace(/^https?:\/\//, '');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: paper,
          backgroundImage: 'radial-gradient(rgba(20,16,12,0.16) 2px, transparent 2px)',
          backgroundSize: '26px 26px',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* top row: country badge + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              display: 'flex',
              background: pop,
              color: ink,
              fontSize: 30,
              fontWeight: 800,
              padding: '12px 26px',
              border: `4px solid ${ink}`,
              borderRadius: 14,
              boxShadow: `7px 7px 0 ${ink}`,
              letterSpacing: 1,
            }}
          >
            {place.country.toUpperCase()}
          </div>
          <div style={{ display: 'flex', color: inkSoft, fontSize: 30, fontWeight: 600 }}>
            {statusLine(place)}
          </div>
        </div>

        {/* red pin + city name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <div
            style={{
              display: 'flex',
              flexShrink: 0,
              width: 72,
              height: 72,
              borderRadius: 999,
              background: pop2,
              border: `7px solid ${ink}`,
              boxShadow: `7px 7px 0 ${ink}`,
            }}
          />
          <div
            style={{
              display: 'flex',
              color: ink,
              fontSize: place.city.length > 11 ? 104 : 140,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -3,
            }}
          >
            {place.city}
          </div>
        </div>

        {/* bottom row: counts + url */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              color: ink,
              fontSize: 32,
              fontWeight: 700,
              background: '#ffffff',
              border: `4px solid ${ink}`,
              borderRadius: 14,
              boxShadow: `7px 7px 0 ${ink}`,
              padding: '18px 28px',
            }}
          >
            {`${plural(place.spots.length, 'spot')} · ${plural(categoryCount, 'category', 'categories')}`}
          </div>
          <div style={{ display: 'flex', color: ink, fontSize: 30, fontWeight: 800 }}>
            {`${host}/${place.slug}`}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
