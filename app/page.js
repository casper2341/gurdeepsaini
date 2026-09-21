import Link from 'next/link';
import PortfolioShell from '@/components/portfolio-shell';
import TypewriterText from '@/components/typewriter-text';
import Reveal from '@/components/reveal';
import { ArrowDownIcon, ArrowIcon } from '@/components/icons';
import { ApkChart, PhoneMock } from '@/components/illustrations';
import { profile, stats, panels, projects } from '@/data/profile';

export default function Home() {
  return (
    <PortfolioShell>
      {/* 1 — HERO */}
      <section className="hero comic-hero">
        <div className="halftone" aria-hidden="true" />
        <div className="hero-inner hero-split">
          <div className="hero-copy">
            <p className="eyebrow">Android Developer · {profile.company}</p>
            <TypewriterText />
            <p className="hero-intro">{profile.tagline}</p>
            <div className="hero-cta">
              <Link href="/projects" className="button">
                See my work <ArrowIcon />
              </Link>
              <Link href="/contact" className="button ghost-button">
                Get in touch
              </Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <PhoneMock />
          </div>
        </div>
        <div className="scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <ArrowDownIcon />
        </div>
      </section>

      {/* 2 — IMPACT STATS */}
      <section className="section stats-section">
        <Reveal as="p" className="section-kicker">By the numbers</Reveal>
        <Reveal as="h2" className="section-title" delay={60}>
          Small numbers, big <span className="pow">impact</span>.
        </Reveal>
        <div className="stats-layout">
          <Reveal className="chart-card">
            <span className="panel-kicker">APK size</span>
            <ApkChart />
            <p className="chart-caption">Shrunk the app 44% with R8, vector drawables &amp; an App Bundle migration.</p>
          </Reveal>
          <div className="stat-grid stat-grid-compact">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} className="stat-card" delay={i * 90}>
                <strong className="stat-value">{stat.value}</strong>
                <span className="stat-label">{stat.label}</span>
                <p className="stat-detail">{stat.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — WHAT I BUILD (comic panels) */}
      <section className="section panels-section">
        <Reveal as="p" className="section-kicker">What I build</Reveal>
        <Reveal as="h2" className="section-title" delay={60}>
          Shipping features that actually <span className="pow">move metrics</span>.
        </Reveal>
        <div className="panel-strip">
          {panels.map((panel, i) => (
            <Reveal key={panel.title} className="comic-panel" delay={i * 80}>
              <span className="panel-kicker">{panel.kicker}</span>
              <h3>{panel.title}</h3>
              <p>{panel.body}</p>
              <span className="panel-tag">{panel.tag}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4 — FEATURED PROJECTS */}
      <section className="section projects-preview">
        <Reveal as="p" className="section-kicker">Featured work</Reveal>
        <Reveal as="h2" className="section-title" delay={60}>
          A few things I&apos;ve <span className="pow">built</span>.
        </Reveal>
        <div className="project-grid">
          {projects.map((project, i) => (
            <Reveal
              key={project.title}
              as="a"
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="project-card"
              delay={i * 90}
            >
              <h3>{project.title}</h3>
              <p>{project.blurb}</p>
              <div className="chip-row">
                {project.stack.map((tech) => (
                  <span key={tech} className="chip">{tech}</span>
                ))}
              </div>
              <span className="project-cta">View on GitHub <ArrowIcon /></span>
            </Reveal>
          ))}
        </div>
        <Reveal className="section-footer-link" delay={120}>
          <Link href="/projects" className="button ghost-button">
            All projects <ArrowIcon />
          </Link>
        </Reveal>
      </section>

      {/* 5 — CONTACT CTA */}
      <section className="section cta-section">
        <Reveal className="cta-panel">
          <p className="eyebrow">Let&apos;s talk</p>
          <h2>Have an Android problem worth solving?</h2>
          <p className="cta-body">
            I&apos;m open to engineering roles and product collaborations where reliability, performance and craft matter.
          </p>
          <div className="hero-cta">
            <a href={`mailto:${profile.email}`} className="button">Email me</a>
            <a href="/resume.pdf" target="_blank" rel="noreferrer" className="button ghost-button">Resume</a>
          </div>
        </Reveal>
      </section>
    </PortfolioShell>
  );
}
