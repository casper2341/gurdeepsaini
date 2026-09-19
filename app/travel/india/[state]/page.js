import Link from 'next/link';
import { notFound } from 'next/navigation';
import TravelShell from '../../../components/travel/travel-shell';
import StateMap from '../../../components/travel/state-map';
import Reveal from '../../../components/reveal';
import { ArrowIcon } from '../../../components/icons';
import { getState, states } from '../../../lib/india';
import { districtsWithPlaces, getStateMap } from '../../../lib/india-districts';
import { placesInState } from '../../../lib/india-places';
import { plural, statusLine, travelSiteName, travelUrl } from '../../../data/travel';
import { profile } from '../../../data/profile';

export const dynamicParams = false;

const named = states.filter((state) => state.id);

export function generateStaticParams() {
  return named.map((state) => ({ state: state.slug }));
}

function describe(state, districts, cities) {
  const been = cities.length
    ? ` ${profile.name} has been to ${cities.map((place) => place.city).join(', ')}.`
    : '';
  return `${state.name}, India — all ${plural(districts, 'district')} on one map.${been}`;
}

export async function generateMetadata({ params }) {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) return {};

  const map = getStateMap(state.id);
  const title = `${state.name}, India`;
  const description = describe(state, map.districts.length, placesInState(state.id));

  return {
    title,
    description,
    alternates: { canonical: `/india/${state.slug}` },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `/india/${state.slug}`,
      siteName: travelSiteName,
      title,
      description,
    },
    twitter: { card: 'summary_large_image', title, description, creator: '@casper2341' },
  };
}

export default async function StatePage({ params }) {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) notFound();

  const map = getStateMap(state.id);
  const visited = districtsWithPlaces(state.id);
  const cities = placesInState(state.id);

  const index = named.findIndex((entry) => entry.id === state.id);
  const prev = named[index - 1] ?? null;
  const next = named[index + 1] ?? null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Travels', item: travelUrl },
      { '@type': 'ListItem', position: 2, name: 'India', item: `${travelUrl}/india` },
      { '@type': 'ListItem', position: 3, name: state.name, item: `${travelUrl}/india/${state.slug}` },
    ],
  };

  return (
    <TravelShell active="india">
      <section className="page-hero city-hero">
        <div className="halftone" aria-hidden="true" />
        <p className="eyebrow">India</p>
        <h1 className="page-title city-title">{state.name}</h1>
        <ul className="city-meta">
          <li>{plural(map.districts.length, 'district')}</li>
          {cities.length ? <li>{plural(cities.length, 'city', 'cities')}</li> : null}
          {visited.size ? <li>{plural(visited.size, 'district', 'districts')} visited</li> : null}
        </ul>
      </section>

      <section className="map-section" aria-label={`Map of ${state.name}`}>
        <StateMap state={state} />
      </section>

      {cities.length ? (
        <section className="section" id="cities">
          <Reveal as="p" className="section-kicker">In {state.name}</Reveal>
          <Reveal as="h2" className="section-title" delay={60}>
            Cities with a <span className="pow">guide</span>.
          </Reveal>
          <div className="place-grid">
            {cities.map((place, i) => (
              <Reveal key={place.slug} delay={i * 90}>
                <Link href={`/${place.slug}`} className="project-card place-card">
                  <span className="panel-kicker">{state.name}</span>
                  <h3>{place.city}</h3>
                  <p>
                    {statusLine(place)} · {plural(place.spots.length, 'spot')}
                  </p>
                  <span className="project-cta">
                    Open city guide <ArrowIcon />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* the districts as plain text, since the map's shapes aren't focusable */}
      <section className="section" id="districts">
        <Reveal as="p" className="section-kicker">Every district</Reveal>
        <Reveal as="h2" className="section-title" delay={60}>
          {plural(map.districts.length, 'district')} in <span className="pow">{state.name}</span>.
        </Reveal>
        <ul className="region-list">
          {map.districts.map((district) => (
            <li key={district.id}>
              <span className={visited.has(district.id) ? 'region-link is-visited' : 'region-link'}>
                {district.name}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <nav className="section city-footer" aria-label="More states">
        <Link href="/india" className="button ghost-button">
          Back to India
        </Link>
        {prev || next ? (
          <div className="city-steps">
            {prev ? (
              <Link href={`/india/${prev.slug}`} className="button small-button ghost-button">
                ← {prev.name}
              </Link>
            ) : null}
            {next ? (
              <Link href={`/india/${next.slug}`} className="button small-button">
                {next.name} <ArrowIcon />
              </Link>
            ) : null}
          </div>
        ) : null}
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </TravelShell>
  );
}
