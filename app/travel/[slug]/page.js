import Link from 'next/link';
import { notFound } from 'next/navigation';
import TravelShell from '@/components/travel/travel-shell';
import SpotFilter from '@/components/travel/spot-filter';
import JsonLd from '@/components/json-ld';
import { ArrowIcon } from '@/components/icons';
import { profile } from '@/data/profile';
import {
  adjacentPlaces,
  getPlace,
  mapsHref,
  places,
  plural,
  spotsByCategory,
  statusLine,
  travelMetadata,
  travelUrl,
} from '@/data/travel';

export const dynamicParams = false;

export function generateStaticParams() {
  return places.map((place) => ({ slug: place.slug }));
}

function describe(place) {
  const labels = spotsByCategory(place).map((group) => group.label.toLowerCase());
  const across = labels.length ? ` across ${labels.join(', ')}` : '';
  return `${profile.name}'s guide to ${place.city}, ${place.country}: ${plural(place.spots.length, 'spot')}${across}.`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) return {};

  return travelMetadata({
    title: `${place.city}, ${place.country}`,
    description: describe(place),
    path: `/${place.slug}`,
  });
}

export default async function CityPage({ params }) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) notFound();

  const groups = spotsByCategory(place).map((group) => ({
    id: group.id,
    label: group.label,
    schema: group.schema,
    spots: group.spots.map((spot) => ({ ...spot, mapHref: mapsHref(spot, place) })),
  }));
  const { prev, next } = adjacentPlaces(place.slug);
  const url = `${travelUrl}/${place.slug}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Travels', item: travelUrl },
        { '@type': 'ListItem', position: 2, name: place.city, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${place.city} — ${profile.name}'s guide`,
      url,
      numberOfItems: place.spots.length,
      itemListElement: groups
        .flatMap((group) =>
          group.spots.map((spot) => ({
            '@type': group.schema,
            name: spot.name,
            ...(spot.note && { description: spot.note }),
            address: {
              '@type': 'PostalAddress',
              addressLocality: place.city,
              addressCountry: place.country,
            },
            hasMap: spot.mapHref,
          }))
        )
        .map((item, i) => ({ '@type': 'ListItem', position: i + 1, item })),
    },
  ];

  return (
    <TravelShell>
      <section className="page-hero city-hero">
        <div className="halftone" aria-hidden="true" />
        <p className="eyebrow">{place.country}</p>
        <h1 className="page-title city-title">{place.city}</h1>
        {place.blurb ? <p className="page-lead">{place.blurb}</p> : null}
        <ul className="city-meta">
          <li>{statusLine(place)}</li>
          <li>{plural(place.spots.length, 'spot')}</li>
          <li>{plural(groups.length, 'category', 'categories')}</li>
        </ul>
      </section>

      <div className="section city-body">
        {groups.length ? (
          <SpotFilter groups={groups} />
        ) : (
          <p className="muted">No spots written up for {place.city} yet.</p>
        )}
      </div>

      <nav className="section city-footer" aria-label="More places">
        <Link href="/" className="button ghost-button">
          Back to the map
        </Link>
        {prev || next ? (
          <div className="city-steps">
            {prev ? (
              <Link href={`/${prev.slug}`} className="button small-button ghost-button">
                ← {prev.city}
              </Link>
            ) : null}
            {next ? (
              <Link href={`/${next.slug}`} className="button small-button">
                {next.city} <ArrowIcon />
              </Link>
            ) : null}
          </div>
        ) : null}
      </nav>

      <JsonLd data={jsonLd} />
    </TravelShell>
  );
}
