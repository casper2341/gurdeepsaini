import Link from 'next/link';
import TravelShell from '@/components/travel/travel-shell';
import IndiaMap from '@/components/travel/india-map';
import Reveal from '@/components/reveal';
import JsonLd from '@/components/json-ld';
import { ArrowIcon } from '@/components/icons';
import { states } from '@/lib/india';
import { statesWithPlaces } from '@/lib/india-places';
import { plural, travelSiteName, travelUrl } from '@/data/travel';
import { profile } from '@/data/profile';

const title = 'India, state by state';
const description = `Every state and union territory of India, with the ones ${profile.name} has spent time in picked out. Open a state to see its districts.`;

export const metadata = {
  title,
  description,
  alternates: { canonical: '/india' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/india',
    siteName: travelSiteName,
    title,
    description,
  },
  twitter: { card: 'summary_large_image', title, description, creator: '@casper2341' },
};

export default function IndiaPage() {
  const named = states.filter((state) => state.id);
  const visited = named.filter((state) => statesWithPlaces.has(state.id));

  // Matches the BreadcrumbList the city and state pages carry.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Travels', item: travelUrl },
      { '@type': 'ListItem', position: 2, name: 'India', item: `${travelUrl}/india` },
    ],
  };

  return (
    <TravelShell active="india">
      <section className="page-hero travel-hero">
        <div className="halftone" aria-hidden="true" />
        <p className="eyebrow">Travel log</p>
        <h1 className="page-title">
          India, state by <span className="pow">state</span>.
        </h1>
        <p className="page-lead">
          All {named.length} states and union territories
          {visited.length ? ', with the ones I’ve spent time in picked out' : ''}. Open any state to
          see its districts.
        </p>
      </section>

      <section className="map-section" aria-label="Map of India">
        <IndiaMap />
      </section>

      {visited.length ? (
        <section className="section" id="visited">
          <Reveal as="p" className="section-kicker">Been there</Reveal>
          <Reveal as="h2" className="section-title" delay={60}>
            States I&apos;ve <span className="pow">landed in</span>.
          </Reveal>
          <div className="place-grid">
            {visited.map((state, i) => {
              const visits = statesWithPlaces.get(state.id);
              return (
                <Reveal key={state.id} delay={i * 90}>
                  <Link href={`/india/${state.slug}`} className="project-card place-card">
                    <span className="panel-kicker">India</span>
                    <h3>{state.name}</h3>
                    <p>
                      {visits.places.map((place) => place.city).join(', ')} ·{' '}
                      {plural(visits.spots, 'spot')}
                    </p>
                    <span className="project-cta">
                      Open districts <ArrowIcon />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* every state as a plain link, so keyboards, screen readers and crawlers get the map's content */}
      <section className="section" id="states">
        <Reveal as="p" className="section-kicker">All of it</Reveal>
        <Reveal as="h2" className="section-title" delay={60}>
          Every state and <span className="pow">union territory</span>.
        </Reveal>
        <ul className="region-list">
          {named.map((state) => (
            <li key={state.id}>
              <Link
                href={`/india/${state.slug}`}
                className={statesWithPlaces.has(state.id) ? 'region-link is-visited' : 'region-link'}
                // the whole list is in the viewport at once; 36 state pages is ~1 MB of prefetch
                prefetch={false}
              >
                {state.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <nav className="section city-footer" aria-label="More maps">
        <Link href="/" className="button ghost-button">
          Back to the world map
        </Link>
      </nav>

      <JsonLd data={jsonLd} />
    </TravelShell>
  );
}
