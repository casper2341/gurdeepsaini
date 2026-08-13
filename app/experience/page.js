import Link from 'next/link';
import PortfolioShell from '../components/portfolio-shell';
import Reveal from '../components/reveal';
import { ArrowIcon } from '../components/icons';
import { experience } from '../data/profile';

export const metadata = {
  title: 'Experience',
  description:
    "Gurdeep Saini's experience as an Android Developer at MoneyView — shipping production fintech features with Kotlin, Compose, KMP and measurable business impact.",
  alternates: { canonical: '/experience' },
};

export default function ExperiencePage() {
  return (
    <PortfolioShell>
      <section className="page-hero">
        <div className="halftone" aria-hidden="true" />
        <Reveal as="p" className="eyebrow">Experience</Reveal>
        <Reveal as="h1" className="page-title" delay={60}>
          A track record of <span className="pow">shipping</span>.
        </Reveal>
        <Reveal as="p" className="page-lead" delay={120}>
          Core feature delivery, product impact and performance engineering — the work behind the numbers.
        </Reveal>
      </section>

      <section className="section">
        <div className="timeline">
          {experience.map((item, i) => (
            <Reveal key={item.role} className="timeline-item" delay={i * 90}>
              <div className="timeline-node" aria-hidden="true" />
              <div className="comic-panel timeline-panel">
                <div className="timeline-head">
                  <div>
                    <h3>{item.role}</h3>
                    <p className="timeline-company">{item.company} · {item.location}</p>
                  </div>
                  <span className="timeline-period">{item.period}</span>
                </div>
                <ul className="bullet-list">
                  {item.impact.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="chip-row">
                  {item.stack.map((tag) => (
                    <span key={tag} className="chip">{tag}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section cta-section">
        <Reveal className="cta-panel">
          <p className="eyebrow">Next</p>
          <h2>See the side projects too.</h2>
          <div className="hero-cta">
            <Link href="/projects" className="button">Explore projects <ArrowIcon /></Link>
            <Link href="/contact" className="button ghost-button">Get in touch</Link>
          </div>
        </Reveal>
      </section>
    </PortfolioShell>
  );
}
