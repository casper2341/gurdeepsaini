import Link from 'next/link';
import PortfolioShell from '../components/portfolio-shell';

const highlights = [
  'Android developer with hands-on experience building scalable fintech applications using Jetpack Compose, MVVM, MVI, and Clean Architecture.',
  'Skilled in Kotlin Multiplatform, dependency injection, and performance optimization with a track record of improving business metrics.',
  'Focused on shipping production-grade features that are reliable, maintainable, and aligned with product and compliance needs.',
];

const stack = ['Kotlin', 'Java', 'Jetpack Compose', 'MVVM', 'MVI', 'Clean Architecture', 'Hilt', 'Koin', 'KMP', 'Firebase', 'Room', 'Retrofit'];

export default function AboutPage() {
  return (
    <PortfolioShell page="about">
      <div className="info-grid">
        <article className="info-card">
          <h2>What I bring</h2>
          <ul>
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="info-card">
          <h2>Toolset</h2>
          <div className="chip-row">
            {stack.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </article>

        <article className="info-card wide-card">
          <h2>Professional focus</h2>
          <p>
            I work at the intersection of Android engineering and fintech product delivery — building features that are performant, scalable, and measurable in real business outcomes.
          </p>
        </article>
      </div>

      <div className="footer-cta">
        <p>Open to thoughtful collaborations and product ideas that need a sharp mobile experience.</p>
        <Link href="/contact" className="button secondary-button">
          Let’s connect
        </Link>
      </div>
    </PortfolioShell>
  );
}
