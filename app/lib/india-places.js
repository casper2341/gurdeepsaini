// Ties travel places to the India map. Which state a city sits in is derived from the coordinates
// already in travel.js — there is no state field to keep in sync, and adding a city still means
// appending one object and nothing else.
//
// Deliberately free of any district import, so the /india page and its OG card don't pull the
// 1.7 MB district file into their server bundle. District grouping lives in india-districts.js.
import { stateIdForCoords } from './india';
import { places } from '../data/travel';

const INDIA = '356';

export const indiaPlaces = places.filter((place) => place.countryId === INDIA);

// Resolved once. Every helper below would otherwise re-run geoContains across all 36 states, on
// every one of the 36 state pages.
const stateIdBySlug = new Map(indiaPlaces.map((place) => [place.slug, stateIdForCoords(place.coords)]));

export const stateIdOf = (place) => stateIdBySlug.get(place.slug) ?? null;

// Same guard as the world map's, one level down. stateIdForCoords already falls back to the nearest
// state within ~11 km, so reaching this means the coordinates aren't in India at all — most likely
// [lat, lng] the wrong way round.
for (const place of indiaPlaces) {
  if (!stateIdOf(place)) {
    console.warn(
      `[travel] ${place.slug}: [${place.coords}] is inside India's country outline but not inside or near any state — check the [lng, lat] order.`
    );
  }
}

// Wishlist entries get a pin but don't colour a state in, exactly as they don't count towards
// visitedCountryIds on the world map.
export const beenTo = indiaPlaces.filter((place) => place.status !== 'wishlist');

export function groupByKey(entries, keyOf) {
  const grouped = new Map();
  for (const place of entries) {
    const key = keyOf(place);
    if (!key) continue;
    const bucket = grouped.get(key) ?? { places: [], spots: 0 };
    bucket.places.push(place);
    bucket.spots += place.spots.length;
    grouped.set(key, bucket);
  }
  return grouped;
}

/** stateId → { places, spots }, visited states only. */
export const statesWithPlaces = groupByKey(beenTo, stateIdOf);

/** Every India place in a state, wishlist included — these are the pins a state map draws. */
export function placesInState(stateId) {
  return indiaPlaces.filter((place) => stateIdOf(place) === stateId);
}
