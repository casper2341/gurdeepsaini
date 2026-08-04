import Link from 'next/link';
import PortfolioShell from '../components/portfolio-shell';

export default function ContactPage() {
  return (
    <PortfolioShell page="contact">
      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">Contact</p>
          <h2>Let’s make an experience feel distinctly yours.</h2>
        </div>
        <div className="contact-card">
          <p>I’m open to Android engineering roles, fintech product teams, and collaborations where strong implementation matters.</p>
          <div className="actions">
            <a href="mailto:codegurdeep@gmail.com" className="button">Email me</a>
            <a href="/resume.pdf" target="_blank" rel="noreferrer" className="button secondary-button">Resume</a>
          </div>
        </div>
      </section>

      <div className="footer-cta">
        <p>Open to engineering opportunities and product collaborations that need reliable Android execution.</p>
        <Link href="/about" className="button secondary-button">
          Learn more
        </Link>
      </div>
    </PortfolioShell>
  );
}
