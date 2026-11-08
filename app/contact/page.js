import PortfolioShell from '@/components/portfolio-shell';
import Reveal from '@/components/reveal';
import { GithubIcon, LinkedinIcon, MailIcon, ResumeIcon } from '@/components/icons';
import { profile } from '@/data/profile';

// Arial Black is wide, and a quarter-width card can't hold the address on one line. <wbr> offers a
// break before the @, so it wraps as "codegurdeep / @gmail.com" rather than mid-word — and since it
// adds no characters, copying the address still copies it whole.
const [emailUser, emailDomain] = profile.email.split('@');

const channels = [
  {
    label: 'Email',
    value: <>{emailUser}<wbr />@{emailDomain}</>,
    href: `mailto:${profile.email}`,
    Icon: MailIcon,
  },
  { label: 'GitHub', value: 'casper2341', href: profile.github, Icon: GithubIcon },
  { label: 'LinkedIn', value: 'gurdeep-saini', href: profile.linkedin, Icon: LinkedinIcon },
  { label: 'Resume', value: 'Download PDF', href: '/resume.pdf', Icon: ResumeIcon },
];

export const metadata = {
  title: 'Contact',
  description:
    'Get in touch with Gurdeep Saini — Android Developer. Reach out by email, GitHub, LinkedIn, or download the resume.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <PortfolioShell>
      <section className="page-hero">
        <div className="halftone" aria-hidden="true" />
        <Reveal as="p" className="eyebrow">Contact</Reveal>
        <Reveal as="h1" className="page-title" delay={60}>
          Let&apos;s make something <span className="pow">distinct</span>.
        </Reveal>
        <Reveal as="p" className="page-lead" delay={120}>
          Open to Android engineering roles, fintech product teams and collaborations where strong implementation matters.
        </Reveal>
      </section>

      <section className="section">
        <div className="contact-grid">
          {channels.map((channel, i) => (
            <Reveal
              key={channel.label}
              as="a"
              href={channel.href}
              target={channel.href.startsWith('http') || channel.href.endsWith('.pdf') ? '_blank' : undefined}
              rel="noreferrer"
              className="contact-card"
              delay={i * 80}
            >
              <span className="contact-icon"><channel.Icon /></span>
              <div className="contact-text">
                <span className="contact-label">{channel.label}</span>
                <span className="contact-value">{channel.value}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section cta-section">
        <Reveal className="cta-panel">
          <p className="eyebrow">Prefer email?</p>
          <h2>Say hello — I reply.</h2>
          <div className="hero-cta">
            <a href={`mailto:${profile.email}`} className="button">Email me</a>
          </div>
        </Reveal>
      </section>
    </PortfolioShell>
  );
}
