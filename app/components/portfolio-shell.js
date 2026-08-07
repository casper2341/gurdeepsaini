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

  // Synthesized mechanical keyboard press: a sharp filtered-noise "click" (the
  // switch snapping) layered over a short low "thock" (the keycap bottoming out).
  const playInteraction = () => {
    if (typeof window === 'undefined') return;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(8);
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;

    // --- the click: a tiny decaying burst of band-passed white noise ---
    const noiseDur = 0.028;
    const frames = Math.max(1, Math.ceil(ctx.sampleRate * noiseDur));
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 2700;
    bandpass.Q.value = 0.8;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.55, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDur);
    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + noiseDur);

    // --- the thock: short low body that bottoms out fast ---
    const thock = ctx.createOscillator();
    thock.type = 'triangle';
    thock.frequency.setValueAtTime(190, now);
    thock.frequency.exponentialRampToValueAtTime(90, now + 0.05);
    const thockGain = ctx.createGain();
    thockGain.gain.setValueAtTime(0.0001, now);
    thockGain.gain.linearRampToValueAtTime(0.26, now + 0.004);
    thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    thock.connect(thockGain);
    thockGain.connect(ctx.destination);
    thock.start(now);
    thock.stop(now + 0.07);
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
