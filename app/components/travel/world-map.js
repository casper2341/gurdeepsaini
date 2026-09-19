import Link from 'next/link';
import MapViewport from './map-viewport';
import MapPin from './map-pin';
import { countries, isInCountry, MAP_HEIGHT, MAP_WIDTH, project } from '../../lib/world';
import { places, plural, statusLine, visitedCountryIds } from '../../data/travel';
import { profile } from '../../data/profile';

const visited = new Set(visitedCountryIds);
// India is the one country with a map of its own behind it, so its shape is a link.
const INDIA = '356';
const india = countries.find((country) => country.id === INDIA);

// Catches swapped [lat, lng] and wrong numeric country ids at build time. Warns
// rather than throws: tiny or coastal places can fall outside the 1:110m outlines.
for (const place of places) {
  if (!isInCountry(place.countryId, place.coords)) {
    console.warn(
      `[travel] ${place.slug}: [${place.coords}] is not inside country ${place.countryId} — check the [lng, lat] order and the ISO numeric id.`
    );
  }
}

// Server-rendered map content; MapViewport only adds pan/zoom around it.
export default function WorldMap() {
  return (
    <MapViewport
      width={MAP_WIDTH}
      height={MAP_HEIGHT}
      label={`World map of places ${profile.name} has visited`}
      hint="Drag to pan · pinch or Ctrl/⌘ + scroll to zoom · pick a red pin, or India for its states"
    >
      <g aria-hidden="true">
        {countries
          .filter((country) => country.id !== INDIA)
          .map((country) => (
            <path
              key={country.id}
              d={country.d}
              className={visited.has(country.id) ? 'country is-visited' : 'country'}
            />
          ))}
      </g>

      {/* after the country group so it's focusable, before the pins so they stay on top */}
      {india ? (
        <Link
          href="/india"
          className="map-region"
          aria-label="India. Open the state and district maps"
          data-title="India"
          data-meta="See it state by state"
          // /india is ~26 KB of path strings; don't fetch it just because the map is on screen
          prefetch={false}
        >
          <path d={india.d} className={visited.has(INDIA) ? 'country is-visited' : 'country'} />
        </Link>
      ) : null}
      {places.map((place) => {
        const { x, y } = project(place.coords);
        return (
          <MapPin
            key={place.slug}
            place={place}
            x={x}
            y={y}
            label={`${place.city}, ${place.country}`}
            meta={`${statusLine(place)} · ${plural(place.spots.length, 'spot')}`}
          />
        );
      })}
    </MapViewport>
  );
}
