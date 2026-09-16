import Link from 'next/link';
import TravelShell from '../components/travel/travel-shell';
import WorldMap from '../components/travel/world-map';
import Reveal from '../components/reveal';
import { ArrowIcon } from '../components/icons';
import { places, plural, statusLine } from '../data/travel';

export default function TravelMap() {
  return (
    <TravelShell active="map">
      <section className="page-hero travel-hero">
        <div className="halftone" aria-hidden="true" />
        <p className="eyebrow">Travel log</p>
        <h1 className="page-title">
          Places I&apos;ve <span className="pow">been</span>.
        </h1>
        <p className="page-lead">
          Every red pin opens a city page — the breweries, gardens, cafés and corners worth going back to.
        </p>
      </section>

      <section className="map-section" aria-label="Map">
        <WorldMap />
      </section>

      {/* the same places as plain links, for keyboards, screen readers and crawlers */}
      <section className="section" id="places">
        <Reveal as="p" className="section-kicker">All places</Reveal>
        <Reveal as="h2" className="section-title" delay={60}>
          Every pin, as a <span className="pow">list</span>.
        </Reveal>
        <div className="place-grid">
          {places.map((place, i) => (
            <Reveal key={place.slug} delay={i * 90}>
              <Link href={`/${place.slug}`} className="project-card place-card">
                <span className="panel-kicker">{place.country}</span>
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
    </TravelShell>
  );
}
