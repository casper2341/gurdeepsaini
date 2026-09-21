import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';
import { places, travelUrl, visitedCountryIds } from '@/data/travel';
import { countries, MAP_HEIGHT, MAP_WIDTH, project } from '@/lib/world';

export const alt = `${profile.name}'s travel map`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Theme tokens mirrored from globals.css (light "paper" palette).
const paper = '#fdf3e3';
const paper2 = '#fff8ec';
const ink = '#14100c';
const inkSoft = '#423a30';
const pop = '#ffcf33';
const pop2 = '#ff5d55';
const pop5 = '#ff9f1c';

export default function Image() {
  const visited = new Set(visitedCountryIds);
  const mapHeight = 400;
  const mapWidth = Math.round((mapHeight * MAP_WIDTH) / MAP_HEIGHT);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: paper,
          backgroundImage: 'radial-gradient(rgba(20,16,12,0.16) 2px, transparent 2px)',
          backgroundSize: '26px 26px',
          padding: '40px 56px 52px',
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
              TRAVEL LOG
            </div>
            <div style={{ display: 'flex', color: ink, fontSize: 56, fontWeight: 900, letterSpacing: -2 }}>
              {profile.name}
            </div>
          </div>
          <div style={{ display: 'flex', color: inkSoft, fontSize: 26, fontWeight: 700 }}>
            {travelUrl.replace(/^https?:\/\//, '')}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            padding: 12,
            background: paper2,
            border: `4px solid ${ink}`,
            borderRadius: 18,
            boxShadow: `8px 8px 0 ${ink}`,
          }}
        >
          <svg width={mapWidth} height={mapHeight} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}>
            {countries.map((country) => (
              <path
                key={country.id}
                d={country.d}
                fill={visited.has(country.id) ? pop5 : pop}
                stroke={ink}
                strokeWidth={0.8}
              />
            ))}
            {places.map((place) => {
              const { x, y } = project(place.coords);
              return (
                <circle key={place.slug} cx={x} cy={y} r={9} fill={pop2} stroke={ink} strokeWidth={3} />
              );
            })}
          </svg>
        </div>
      </div>
    ),
    { ...size }
  );
}
