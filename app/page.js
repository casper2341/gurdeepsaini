import Link from 'next/link';
import PortfolioShell from './components/portfolio-shell';

const previewCards = [
  {
    title: 'About',
    blurb: 'Android developer focused on production-grade fintech apps, scalable architecture, and measurable product impact.',
    href: '/about',
  },
  {
    title: 'Experience',
    blurb: 'Experience shipping features for loan disbursals, referral systems, and Android performance optimization at scale.',
    href: '/experience',
  },
  {
    title: 'Projects',
    blurb: 'A dedicated portfolio of Android apps, AI-enabled experiments, and implementation-focused side projects.',
    href: '/projects',
  },
  {
    title: 'Contact',
    blurb: 'Open to engineering roles and product collaborations where Android quality, reliability, and speed matter.',
    href: '/contact',
  },
];

export default function Home() {
  return (
    <PortfolioShell page="home">
      <div className="mini-grid">
        {previewCards.map((card) => (
          <Link key={card.title} href={card.href} className="mini-card">
            <h3>{card.title}</h3>
            <p>{card.blurb}</p>
          </Link>
        ))}
      </div>

      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">Selected work</p>
          <h2>Projects now live in a dedicated space so the story stays focused and easier to scan.</h2>
        </div>
        <div className="mini-grid">
          <Link href="/projects" className="mini-card">
            <h3>View full projects</h3>
            <p>Explore the Android apps and product experiments that reflect both delivery and experimentation.</p>
          </Link>
        </div>
      </section>

      <div className="footer-cta">
        <p>Building Android products that balance reliability, performance, and business impact.</p>
        <Link href="/contact" className="button secondary-button">
          Let’s connect
        </Link>
      </div>
    </PortfolioShell>
  );
}
