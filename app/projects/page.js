import Link from 'next/link';
import PortfolioShell from '../components/portfolio-shell';

const projects = [
  {
    title: 'Doctor Patient Appointment App',
    blurb: 'Built with Jetpack Compose, Firebase, Hilt, and MVVM following Material Design 3 principles for a smooth appointment experience.',
    stack: ['Jetpack Compose', 'Firebase', 'Hilt', 'MVVM'],
    href: 'https://github.com/casper2341/doctor-patient-appointment-app',
  },
  {
    title: 'GenAI Resume Enhancement App',
    blurb: 'Developed an AI-powered resume analyzer using the Gemini API, Firebase Remote Config, PDF parsing, and a polished Compose-based UI.',
    stack: ['Gemini API', 'Compose', 'Remote Config', 'PDF Parsing'],
    href: 'https://github.com/casper2341/genai-resume-enhancement-app',
  },
  {
    title: 'Android Development POC Collection',
    blurb: 'A practical collection of Android proof-of-concepts covering Room Database, Firestore, Google Sign-In, and remote configuration patterns.',
    stack: ['Room', 'Firestore', 'Google Sign-In', 'Remote Config'],
    href: 'https://github.com/casper2341/android-poc-collection',
  },
];

export default function ProjectsPage() {
  return (
    <PortfolioShell page="projects">
      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">Projects</p>
          <h2>Selected apps and experiments that reflect my Android and product focus.</h2>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <article key={project.title} className="project-card">
              <div className={`project-preview ${project.title.includes('GenAI') ? 'accent-cyan' : project.title.includes('Doctor') ? 'accent-violet' : 'accent-gold'}`} />
              <h3>{project.title}</h3>
              <p>{project.blurb}</p>
              <div className="chip-row">
                {project.stack.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
              <a href={project.href} target="_blank" rel="noreferrer" className="button small-button" style={{ marginTop: '0.8rem' }}>
                View on GitHub
              </a>
            </article>
          ))}
        </div>
      </section>

      <div className="footer-cta">
        <p>These projects reflect my ongoing interest in practical product work, modern Android tooling, and thoughtful user experiences.</p>
        <Link href="/contact" className="button secondary-button">
          Get in touch
        </Link>
      </div>
    </PortfolioShell>
  );
}
