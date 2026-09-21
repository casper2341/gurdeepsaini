import { ImageResponse } from 'next/og';
import { comic, halftone, halftoneSize } from '@/data/theme';
import { profile } from '@/data/profile';
import { travelUrl } from '@/data/travel';
import { INDIA_SIZE, projectIndia, states } from '@/lib/india';
import { indiaPlaces, statesWithPlaces } from '@/lib/india-places';

export const alt = `${profile.name}'s map of India, state by state`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The palette lives in one place now; see the warning in data/theme.js.
const { paper, paper2, ink, inkSoft, pop, pop2, pop5 } = comic;

export default function Image() {
  // India is portrait, so unlike the world card the map is narrow and there's room beside it
  const mapHeight = 430;
  const mapWidth = Math.round((mapHeight * INDIA_SIZE.width) / INDIA_SIZE.height);

  const spots = [...statesWithPlaces.values()].reduce((sum, entry) => sum + entry.spots, 0);
  const cities = [...statesWithPlaces.values()].reduce((sum, entry) => sum + entry.places.length, 0);
  const counts = [
    [statesWithPlaces.size, statesWithPlaces.size === 1 ? 'state' : 'states'],
    [cities, cities === 1 ? 'city' : 'cities'],
    [spots, spots === 1 ? 'spot' : 'spots'],
  ];

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
          backgroundImage: halftone,
          backgroundSize: halftoneSize,
          padding: '40px 56px 44px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div
              style={{
                display: 'flex',
                background: pop,
                color: ink,
                fontSize: 26,
                fontWeight: 800,
                padding: '10px 22px',
                border: `4px solid ${ink}`,
                borderRadius: 14,
                boxShadow: `6px 6px 0 ${ink}`,
                letterSpacing: 1,
              }}
            >
              INDIA
            </div>
            <div style={{ display: 'flex', color: ink, fontSize: 52, fontWeight: 900, letterSpacing: -2 }}>
              {profile.name}
            </div>
          </div>
          <div style={{ display: 'flex', color: inkSoft, fontSize: 24, fontWeight: 700 }}>
            {travelUrl.replace(/^https?:\/\//, '')}/india
          </div>
        </div>

        <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 48 }}>
          <div
            style={{
              display: 'flex',
              padding: 10,
              background: paper2,
              border: `4px solid ${ink}`,
              borderRadius: 18,
              boxShadow: `8px 8px 0 ${ink}`,
            }}
          >
            <svg width={mapWidth} height={mapHeight} viewBox={`0 0 ${INDIA_SIZE.width} ${INDIA_SIZE.height}`}>
              {states.map((state, i) => (
                <path
                  key={state.id ?? `unclaimed-${i}`}
                  d={state.d}
                  fill={state.id && statesWithPlaces.has(state.id) ? pop5 : pop}
                  stroke={ink}
                  strokeWidth={1.4}
                />
              ))}
              {indiaPlaces.map((place) => {
                const { x, y } = projectIndia(place.coords);
                return <circle key={place.slug} cx={x} cy={y} r={14} fill={pop2} stroke={ink} strokeWidth={5} />;
              })}
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', color: ink, fontSize: 62, fontWeight: 900, letterSpacing: -2, lineHeight: 1.05 }}>
              State by state
            </div>
            {counts.map(([value, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <div style={{ display: 'flex', color: pop2, fontSize: 46, fontWeight: 900 }}>{value}</div>
                <div style={{ display: 'flex', color: inkSoft, fontSize: 28, fontWeight: 700 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
