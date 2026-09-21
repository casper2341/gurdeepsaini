import Link from 'next/link';
import { ClickSound, ThemeToggle } from '@/components/comic-chrome';
import { SiteFooter } from '@/components/site-chrome';
import { profile, siteUrl } from '@/data/profile';

// Travel-site chrome. `active` is passed in by each page rather than read from
// usePathname(), which hydration-mismatches on pages served through proxy.js rewrites.
export default function TravelShell({ active, children }) {
  return (
    <div className="site">
      <ClickSound />
      <header className="top-nav">
        <Link href="/" className="brand-mark" aria-label="Travel map">
          <span className="brand-badge">GS</span>
          <span className="brand-name">Travels</span>
        </Link>

        <nav className="travel-nav" aria-label="Travel">
          <Link href="/" className={`nav-link ${active === 'map' ? 'active' : ''}`}>
            Map
          </Link>
          {/* always in the viewport, and /india is ~26 KB of path strings */}
          <Link href="/india" className={`nav-link ${active === 'india' ? 'active' : ''}`} prefetch={false}>
            India
          </Link>
          <Link href="/#places" className="nav-link">
            Places
          </Link>
          <a href={siteUrl} className="nav-link">
            ← Main site
          </a>
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
        </div>
      </header>

      <main className="site-main">{children}</main>

      <SiteFooter
        tagline={
          <>
            Travel log · <a href={siteUrl}>{siteUrl.replace(/^https?:\/\//, '')}</a>
          </>
        }
        copy={`Map outlines: Natural Earth · India: Survey of India, via DataMeet · © ${profile.name}`}
      />
    </div>
  );
}
