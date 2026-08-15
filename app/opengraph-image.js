import { ImageResponse } from 'next/og';
import { profile, stats } from './data/profile';

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Theme tokens mirrored from globals.css (light "paper" palette).
const paper = '#fdf3e3';
const ink = '#14100c';
const inkSoft = '#423a30';
const pop = '#ffcf33';
const pop3 = '#3b6cff';

export default function Image() {
  const headline = stats[0]; // "44% Smaller APK"

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
          backgroundImage: `radial-gradient(${'rgba(20,16,12,0.16)'} 2px, transparent 2px)`,
          backgroundSize: '26px 26px',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* top row: role badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
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
            {profile.role.toUpperCase()}
          </div>
          <div style={{ display: 'flex', color: inkSoft, fontSize: 28, fontWeight: 600 }}>
            @ {profile.company}
          </div>
        </div>

        {/* name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              color: ink,
              fontSize: 128,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            {profile.name}
          </div>
          <div style={{ display: 'flex', color: inkSoft, fontSize: 36, fontWeight: 500 }}>
            Kotlin · Jetpack Compose · Kotlin Multiplatform · Fintech
          </div>
        </div>

        {/* bottom row: stat + url */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
              background: '#ffffff',
              border: `4px solid ${ink}`,
              borderRadius: 14,
              boxShadow: `7px 7px 0 ${ink}`,
              padding: '18px 28px',
            }}
          >
            <div style={{ display: 'flex', color: pop3, fontSize: 52, fontWeight: 900 }}>
              {headline.value}
            </div>
            <div style={{ display: 'flex', color: ink, fontSize: 32, fontWeight: 700 }}>
              {headline.label}
            </div>
          </div>
          <div style={{ display: 'flex', color: ink, fontSize: 32, fontWeight: 800 }}>
            gurdeepsaini.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
