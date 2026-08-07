'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { GithubIcon, LinkedinIcon, MailIcon, MoonIcon, ResumeIcon, SunIcon } from './icons';
import { profile } from '../data/profile';

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
  const [isDark, setIsDark] = useState(true);
  const audioContextRef = useRef(null);

  const playInteraction = (mode = 'click') => {
    if (typeof window === 'undefined') return;

    if (typeof navigator !== 'undefined' && navigator.vibrate && mode === 'click') {
      navigator.vibrate(12);
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const tone = ctx.createOscillator();
    const click = ctx.createOscillator();
    const gain = ctx.createGain();

    tone.type = 'square';
    tone.frequency.setValueAtTime(760, now);
    tone.frequency.exponentialRampToValueAtTime(420, now + 0.045);

    click.type = 'triangle';
    click.frequency.setValueAtTime(1400, now);
    click.frequency.exponentialRampToValueAtTime(900, now + 0.04);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.007);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    tone.connect(gain);
    click.connect(gain);
    gain.connect(ctx.destination);

    tone.start(now);
    click.start(now);
    tone.stop(now + 0.06);
    click.stop(now + 0.06);
  };

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        document.body.classList.toggle('dark-theme', next);
        window.localStorage.setItem('theme', next ? 'dark' : 'light');
      }
      return next;
    });
  };

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : true;
    setIsDark(shouldUseDark);
    document.body.classList.toggle('dark-theme', shouldUseDark);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-locked', menuOpen);
    return () => document.body.classList.remove('menu-locked');
  }, [menuOpen]);

  useEffect(() => {
    const handleClick = (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('.button, button, .nav-link, .icon-button')) {
        playInteraction('click');
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="site">
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
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
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
