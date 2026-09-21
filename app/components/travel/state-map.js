import MapViewport from '@/components/travel/map-viewport';
import MapPin from '@/components/travel/map-pin';
import { districtsWithPlaces, getStateMap } from '@/lib/india-districts';
import { placesInState } from '@/lib/india-places';
import { plural, statusLine } from '@/data/travel';

// One state, drawn to fill the frame, with every district outlined. Districts aren't links —
// there's nothing behind most of them — so they sit in an aria-hidden group and the district list
// on the page is what keyboards and screen readers get. Hovering one still names it.
export default async function StateMap({ state }) {
  // Both are cached per state, so awaiting them here costs nothing the page hasn't already paid.
  const [map, visited] = await Promise.all([getStateMap(state.id), districtsWithPlaces(state.id)]);
  const pins = placesInState(state.id);

  return (
    <MapViewport
      width={map.width}
      height={map.height}
      label={`Map of ${state.name}, by district`}
      hint={`Drag to pan · pinch or Ctrl/⌘ + scroll to zoom · ${plural(map.districts.length, 'district')}`}
      maxZoom={4}
      controls={map.corner}
      fitFrame
    >
      <g aria-hidden="true">
        {map.districts.map((district) => {
          const visits = visited.get(district.id);
          return (
            <path
              key={district.id}
              d={district.d}
              className={visits ? 'district is-visited' : 'district'}
              data-title={district.name}
              data-meta={
                visits
                  ? `${plural(visits.places.length, 'city', 'cities')} · ${plural(visits.spots, 'spot')}`
                  : state.name
              }
            />
          );
        })}
      </g>

      {pins.map((place) => {
        const { x, y } = map.project(place.coords);
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
