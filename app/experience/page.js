import Link from 'next/link';
import PortfolioShell from '../components/portfolio-shell';

const experience = [
  {
    role: 'Android Developer',
    company: 'MoneyView',
    period: 'Feb 2023 — Present',
    location: 'Bengaluru, India',
    impact: [
      'Delivered core Android product features for the loan journey while keeping the experience reliable and product-focused.',
      'Built and scaled a referral system that supported user growth and stayed maintainable as the product evolved.',
      'Improved packaging and performance, reducing APK size by 44% and making onboarding and updates feel lighter.',
      'Contributed to product work that supported over Rs. 400+ Cr in loan disbursals.',
    ],
    stack: ['Android', 'Kotlin', 'Product Delivery', 'Performance'],
  },
  {
    role: 'Independent Mobile Product Builder',
    company: 'Personal Projects',
    period: '2022 — Present',
    location: 'Remote',
    impact: [
      'Built practical Android apps focused on clean UX, maintainable architecture, and thoughtful user journeys.',
      'Explored AI-assisted experiences, Firebase integration, and modern Compose-based interfaces in real products.',
      'Strengthened product thinking through side projects that balance design quality with practical implementation.',
    ],
    stack: ['Jetpack Compose', 'Firebase', 'MVVM', 'Material 3'],
  },
];

export default function ExperiencePage() {
  return (
    <PortfolioShell page="experience">
      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">Experience</p>
          <h2>Building product-minded Android experiences with measurable outcomes.</h2>
          <p className="section-copy">
            My work spans core feature delivery, product impact, and performance-focused engineering.
          </p>
        </div>

        <div className="timeline">
          {experience.map((item) => (
            <article key={item.role} className="timeline-item">
              <div className="timeline-marker" />
              <div className="timeline-content">
                <div className="timeline-header">
                  <div>
                    <h3>{item.role}</h3>
                    <p>{item.company} • {item.location}</p>
                  </div>
                  <span>{item.period}</span>
                </div>

                <ul className="timeline-points">
                  {item.impact.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <div className="chip-row">
                  {item.stack.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="footer-cta">
        <p>Focused on shipping Android experiences that are reliable, scalable, and built for real business impact.</p>
        <Link href="/projects" className="button secondary-button">
          Explore projects
        </Link>
      </div>
    </PortfolioShell>
  );
}
