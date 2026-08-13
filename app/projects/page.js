import Link from 'next/link';
import PortfolioShell from '../components/portfolio-shell';
import Reveal from '../components/reveal';
import { ArrowIcon, ExternalIcon } from '../components/icons';
import { projects } from '../data/profile';

export const metadata = {
  title: 'Projects',
  description:
    'A collection of Android and Kotlin projects by Gurdeep Saini — Jetpack Compose, Firebase, Room, WorkManager, GenAI and more.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsPage() {
  return (
    <PortfolioShell>
      <section className="page-hero">
        <div className="halftone" aria-hidden="true" />
        <Reveal as="p" className="eyebrow">Projects</Reveal>
        <Reveal as="h1" className="page-title" delay={60}>
          Things I build for <span className="pow">fun</span> and rigor.
        </Reveal>
        <Reveal as="p" className="page-lead" delay={120}>
          Android apps, AI-enabled experiments and implementation-focused proofs of concept — all on GitHub.
        </Reveal>
      </section>

      <section className="section">
        <div className="project-grid wide">
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
              <span className="project-external" aria-hidden="true"><ExternalIcon /></span>
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
      </section>

      <section className="section cta-section">
        <Reveal className="cta-panel">
          <p className="eyebrow">Let&apos;s build</p>
          <h2>Want to collaborate on something?</h2>
          <div className="hero-cta">
            <Link href="/contact" className="button">Get in touch <ArrowIcon /></Link>
          </div>
        </Reveal>
      </section>
    </PortfolioShell>
  );
}
