'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  { href: 'https://github.com/casper2341', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/gurdeep-saini-349a2227b/', label: 'LinkedIn' },
];

export default function PortfolioShell({ children, page = 'home' }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
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
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const tone = ctx.createOscillator();
    const click = ctx.createOscillator();
    const clack = ctx.createOscillator();
    const gain = ctx.createGain();

    tone.type = 'square';
    tone.frequency.setValueAtTime(760, now);
    tone.frequency.exponentialRampToValueAtTime(420, now + 0.045);
    tone.detune.value = -12;

    click.type = 'triangle';
    click.frequency.setValueAtTime(1400, now);
    click.frequency.exponentialRampToValueAtTime(900, now + 0.04);
    click.detune.value = 24;

    clack.type = 'square';
    clack.frequency.setValueAtTime(4000, now);
    clack.frequency.exponentialRampToValueAtTime(2800, now + 0.02);
    clack.detune.value = 0;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.007);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    tone.connect(gain);
    click.connect(gain);
    clack.connect(gain);
    gain.connect(ctx.destination);

    tone.start(now);
    click.start(now);
    clack.start(now);
    tone.stop(now + 0.06);
    click.stop(now + 0.06);
    clack.stop(now + 0.03);
  };

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        document.body.classList.toggle('dark-theme', next);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('theme', next ? 'dark' : 'light');
        }
      }
      return next;
    });
  };

  const handleNavClick = () => {
    setMenuOpen(false);
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
    const handleScroll = () => {
      setParallaxOffset(Math.min(window.scrollY * 0.18, 70));
    };

    const handleClick = (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('.button, button')) {
        playInteraction('click');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
      <main className="page-shell" key={pathname || page}>
        <section className="dashboard">
        <nav className="top-nav">
          <Link href="/" className="brand-mark">
            GS
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-label="Toggle navigation"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
          >
            ☰
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={handleNavClick}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="nav-actions">
            <button className="button small-button ghost-button" type="button" onClick={toggleTheme}>
              {isDark ? 'Light' : 'Dark'}
            </button>
            <a className="button small-button" href="/resume.pdf" target="_blank" rel="noreferrer">
              Resume
            </a>
          </div>
        </nav>

        {page === 'home' ? (
          <div className="hero-panel editorial-hero" style={{ '--hero-parallax': `${parallaxOffset}px` }}>
            <div className="hero-copy">
              <p className="eyebrow interactive-word">Mobile App Developer • Product-minded</p>
              <h1>
                Designing <span className="highlight-word">calm</span> digital products that feel <span className="highlight-word">effortless</span>.
              </h1>
              <p className="intro">
                I craft mobile journeys that feel trustworthy from the first tap — balancing product clarity, refined UI, and thoughtful engineering.
              </p>
              <div className="actions">
                {socialLinks.map((link) => (
                  <a key={link.label} href={link.href} className="button" target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="hero-side">
              <div className="hero-card">
                <p className="eyebrow">Currently</p>
                <strong>Building polished fintech experiences with deliberate motion.</strong>
              </div>
              <div className="hero-card compact">
                <span>Focus</span>
                <p>UX systems • Product thinking • Mobile craft</p>
              </div>
            </div>
          </div>
        ) : (
          <section className="page-hero">
            <p className="eyebrow interactive-word">{page === 'about' ? 'About' : page === 'experience' ? 'Experience' : page === 'projects' ? 'Projects' : 'Contact'}</p>
            <h2>{page === 'about' ? 'A thoughtful product lens shaped by mobile craft.' : page === 'experience' ? 'A track record built around clarity and momentum.' : page === 'projects' ? 'A growing portfolio of product and mobile experimentation.' : 'Let’s create something distinctive together.'}</h2>
            <p className="page-intro">
              {page === 'about'
                ? 'I’m interested in the quiet details that make products feel intuitive, calm, and memorable.'
                : page === 'experience'
                  ? 'My work blends product impact, mobile engineering, and a focused approach to delivery.'
                  : page === 'projects'
                    ? 'A mix of Android product work, implementation experiments, and AI-enabled tools built with care.'
                    : 'I’m open to product collaborations, design systems, and mobile experiences that need care.'}
            </p>
          </section>
        )}

        <div className="page-body">{children}</div>
      </section>
    </main>
  );
}
