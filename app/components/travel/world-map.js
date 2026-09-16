import Link from 'next/link';
import MapViewport from './map-viewport';
import { countries, isInCountry, MAP_HEIGHT, MAP_WIDTH, project } from '../../lib/world';
import { places, plural, statusLine, visitedCountryIds } from '../../data/travel';
import { profile } from '../../data/profile';

const visited = new Set(visitedCountryIds);

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
    >
      <g aria-hidden="true">
        {countries.map((country) => (
          <path
            key={country.id}
            d={country.d}
            className={visited.has(country.id) ? 'country is-visited' : 'country'}
          />
        ))}
      </g>
      {places.map((place) => {
        const { x, y } = project(place.coords);
        const meta = `${statusLine(place)} · ${plural(place.spots.length, 'spot')}`;
        return (
          <g key={place.slug} transform={`translate(${x} ${y})`}>
            <Link
              href={`/${place.slug}`}
              className={`map-pin is-${place.status}`}
              aria-label={`${place.city}, ${place.country}. ${meta}`}
              data-title={`${place.city}, ${place.country}`}
              data-meta={meta}
            >
              {/* geometry is in screen px — CSS scales it by --u / --k */}
              <g className="map-pin-body">
                <circle className="map-pin-hit" r="14" />
                <circle className="map-pin-pulse" r="7" />
                <circle className="map-pin-shadow" cx="2" cy="2" r="7" />
                <circle className="map-pin-dot" r="7" />
              </g>
            </Link>
          </g>
        );
      })}
    </MapViewport>
  );
}
