import Link from 'next/link';
import PortfolioShell from '@/components/portfolio-shell';
import Reveal from '@/components/reveal';
import { ArrowIcon } from '@/components/icons';
import { profile, skills, education, stats } from '@/data/profile';

const highlights = [
  'Android developer building scalable fintech apps with Jetpack Compose, MVVM/MVI and Clean Architecture.',
  'Comfortable across Kotlin Multiplatform, dependency injection and performance work — with a habit of tying it back to business metrics.',
  'Focused on production-grade features that stay reliable, maintainable and compliant.',
];

export const metadata = {
  title: 'About',
  description:
    'About Gurdeep Saini — an Android developer building scalable fintech apps with Jetpack Compose, MVVM/MVI, Clean Architecture and Kotlin Multiplatform.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <PortfolioShell>
      <section className="page-hero">
        <div className="halftone" aria-hidden="true" />
        <Reveal as="p" className="eyebrow">About</Reveal>
        <Reveal as="h1" className="page-title" delay={60}>
          Android engineer who sweats the <span className="pow">details</span>.
        </Reveal>
        <Reveal as="p" className="page-lead" delay={120}>
          I&apos;m {profile.name.split(' ')[0]} — an Android developer at {profile.company} in {profile.location}, working where mobile
          engineering meets fintech product delivery.
        </Reveal>
      </section>

      <section className="section">
        <div className="about-grid">
          <Reveal className="comic-panel">
            <span className="panel-kicker">What I bring</span>
            <ul className="bullet-list">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="comic-panel accent-panel" delay={90}>
            <span className="panel-kicker">Education</span>
            <h3>{education.school}</h3>
            <p>{education.degree}</p>
            <p className="muted">{education.detail} · {education.period}</p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <Reveal as="p" className="section-kicker">The stack</Reveal>
        <Reveal as="h2" className="section-title" delay={60}>
          Tools I reach for, <span className="pow">daily</span>.
        </Reveal>
        <div className="skills-grid">
          {skills.map((group, i) => (
            <Reveal key={group.group} className="skill-card" delay={i * 60}>
              <h3>{group.group}</h3>
              <div className="chip-row">
                {group.items.map((item) => (
                  <span key={item} className="chip">{item}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="stat-grid">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} className="stat-card" delay={i * 80}>
              <strong className="stat-value">{stat.value}</strong>
              <span className="stat-label">{stat.label}</span>
              <p className="stat-detail">{stat.detail}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section cta-section">
        <Reveal className="cta-panel">
          <p className="eyebrow">Next</p>
          <h2>See what that looks like in practice.</h2>
          <div className="hero-cta">
            <Link href="/experience" className="button">Experience <ArrowIcon /></Link>
            <Link href="/projects" className="button ghost-button">Projects</Link>
          </div>
        </Reveal>
      </section>
    </PortfolioShell>
  );
}
