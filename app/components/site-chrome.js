import { GithubIcon, LinkedinIcon, MailIcon } from '@/components/icons';
import { profile } from '@/data/profile';

// The parts of the chrome the portfolio and travel shells genuinely share.
//
// Their headers do NOT belong here: PortfolioShell is a client component because it reads
// usePathname() for the active nav link and owns the mobile drawer, while TravelShell is a server
// component that takes `active` as a prop — usePathname() hydration-mismatches on pages served
// through proxy.js rewrites. That difference is deliberate, so only the footer and the social row
// are lifted, which is where the copy-paste actually was (four identical blocks).

export function SiteSocials({ className = 'footer-socials' }) {
  return (
    <div className={className}>
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
  );
}

// `tagline` is the line under the name, and `copy` the bottom rule — the only two things that
// differ between the two sites' footers.
export function SiteFooter({ tagline, copy }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <p className="footer-name">{profile.name}</p>
          <p className="footer-role">{tagline}</p>
        </div>
        <SiteSocials />
      </div>
      <p className="footer-copy">{copy}</p>
    </footer>
  );
}
