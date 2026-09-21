'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ClickSound, ThemeToggle } from '@/components/comic-chrome';
import { GithubIcon, LinkedinIcon, MailIcon, ResumeIcon } from '@/components/icons';
import { profile } from '@/data/profile';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

export default function PortfolioShell({ children }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-locked', menuOpen);
    return () => document.body.classList.remove('menu-locked');
  }, [menuOpen]);

  return (
    <div className="site">
      <ClickSound />
      <header className="top-nav">
        <Link href="/" className="brand-mark" aria-label="Home">
          <span className="brand-badge">GS</span>
          <span className="brand-name">{profile.name}</span>
        </Link>

        <nav className="nav-desktop" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <a className="icon-button" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GithubIcon />
          </a>
          <a className="icon-button" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedinIcon />
          </a>
          <ThemeToggle />
          <a className="button small-button resume-link" href="/resume.pdf" target="_blank" rel="noreferrer">
            <ResumeIcon />
            <span>Resume</span>
          </a>
          <button
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <nav aria-label="Mobile">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`drawer-link ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="drawer-index">0{navItems.indexOf(item) + 1}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="drawer-socials">
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
      {menuOpen && <div className="drawer-scrim" onClick={() => setMenuOpen(false)} />}

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <p className="footer-name">{profile.name}</p>
            <p className="footer-role">{profile.role} · {profile.location}</p>
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
        <p className="footer-copy">Built with Next.js · Kotlin at heart · © {profile.name}</p>
      </footer>
    </div>
  );
}
