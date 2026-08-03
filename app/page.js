import Link from 'next/link';

const links = [
  { href: 'https://github.com/casper2341', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/gurdeep-saini-349a2227b/', label: 'LinkedIn' },
];

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Hello, I’m</p>
        <h1>Gurdeep Saini</h1>
        <p className="intro">
          I am a mobile app developer working in a fintech startup. I have a passion for building beautiful and functional mobile applications that solve real-world problems. I am always looking for new challenges and opportunities to learn and grow as a developer.
        </p>
        <div className="actions">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="button" target="_blank" rel="noreferrer">
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
