import Link from 'next/link';
import MapViewport from './map-viewport';
import MapPin from './map-pin';
import { INDIA_SIZE, projectIndia, states } from '../../lib/india';
import { indiaPlaces, statesWithPlaces } from '../../lib/india-places';
import { plural, statusLine } from '../../data/travel';
import { profile } from '../../data/profile';

// Server-rendered map of India; MapViewport only adds pan/zoom around it.
export default function IndiaMap() {
  return (
    <MapViewport
      width={INDIA_SIZE.width}
      height={INDIA_SIZE.height}
      label={`Map of India, by state. States ${profile.name} has visited are highlighted.`}
      hint="Drag to pan · pinch or Ctrl/⌘ + scroll to zoom · pick a state to see its districts"
      controls={INDIA_SIZE.corner}
      fitFrame
    >
      {/* the slivers disputed between states: drawn so the landmass has no holes, and nothing else */}
      <g aria-hidden="true">
        {states
          .filter((state) => !state.id)
          .map((state, i) => (
            <path key={`unclaimed-${i}`} d={state.d} className="country" />
          ))}
      </g>

      {states
        .filter((state) => state.id)
        .map((state) => {
          const visits = statesWithPlaces.get(state.id);
          const meta = visits
            ? `${plural(visits.places.length, 'city', 'cities')} · ${plural(visits.spots, 'spot')}`
            : 'Not been yet';
          return (
            <Link
              key={state.id}
              href={`/india/${state.slug}`}
              className="map-region"
              aria-label={`${state.name}. ${meta}`}
              data-title={state.name}
              data-meta={meta}
              // 36 of these are on screen at once, each 20–33 KB of district paths
              prefetch={false}
            >
              <path d={state.d} className={visits ? 'country is-visited' : 'country'} />
            </Link>
          );
        })}

      {indiaPlaces.map((place) => {
        const { x, y } = projectIndia(place.coords);
        return (
          <MapPin
            key={place.slug}
            place={place}
            x={x}
            y={y}
            label={place.city}
            meta={`${statusLine(place)} · ${plural(place.spots.length, 'spot')}`}
          />
        );
      })}
    </MapViewport>
  );
}
