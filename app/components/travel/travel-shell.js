import Link from 'next/link';
import { ClickSound, ThemeToggle } from '../comic-chrome';
import { GithubIcon, LinkedinIcon, MailIcon } from '../icons';
import { profile, siteUrl } from '../../data/profile';

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

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <p className="footer-name">{profile.name}</p>
            <p className="footer-role">
              Travel log · <a href={siteUrl}>{siteUrl.replace(/^https?:\/\//, '')}</a>
            </p>
          </div>
          <div className="footer-socials">
            <a className="icon-button" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GithubIcon />
            </a>
            <a className="icon-button" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedinIcon />
            </a>
            <a className="icon-button" href={`mailto:${profile.email}`} aria-label="Email">
              <MailIcon />
            </a>
          </div>
        </div>
        <p className="footer-copy">Map outlines: Natural Earth · © {profile.name}</p>
      </footer>
    </div>
  );
}
