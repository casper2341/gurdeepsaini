// Server-only. The district geometry for one state, loaded on demand.
//
// This used to `import` a single 1.7 MB object holding all 36 states, so rendering one state page
// parsed every state's districts — and static generation runs seven workers in parallel, so up to
// seven copies of that parse were resident at once. Each state is its own ~49 KB file now, and a
// page parses only its own.
//
// Nothing here is ever reachable from a client component, and `server-only` enforces that rather
// than trusting the convention: importing this from a 'use client' module fails the build.
import 'server-only';
import { geoContains, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { displayName, fitToBox, toPoint } from '@/lib/india';
import { beenTo, groupByKey, stateIdOf } from '@/lib/india-places';
// { "<state LGD>": <district count> } — counts with no geometry attached, so a route that only
// needs the number never pulls in a boundary file. generateMetadata is exactly that case.
import manifest from '@/lib/districts/manifest.json';

export const hasDistricts = (stateId) => Object.hasOwn(manifest, stateId);

/** How many districts a state has, without loading any of its geometry. */
export function districtCount(stateId) {
  const count = manifest[stateId];
  if (count === undefined) {
    throw new Error(`india-districts.js: no district data for state '${stateId}'`);
  }
  return count;
}

// Each state gets its own projection fitted to itself, so every state map fills the same frame.
// The PROMISE is cached rather than the resolved map: a page and its components both ask for this,
// and caching the promise means the second caller awaits the first parse instead of starting another.
const stateMaps = new Map();

export function getStateMap(stateId) {
  const cached = stateMaps.get(stateId);
  if (cached) return cached;

  const pending = loadStateMap(stateId);
  stateMaps.set(stateId, pending);
  return pending;
}

async function loadStateMap(stateId) {
  if (!hasDistricts(stateId)) {
    // The per-state files and the manifest are generated together, so a miss means they're out of
    // step — worth failing loudly rather than returning null for a caller to dereference.
    throw new Error(`india-districts.js: no district data for state '${stateId}'`);
  }

  // The template literal is what lets the bundler split these into one chunk per state and load
  // exactly one; a plain variable would defeat that and pull in all 36.
  const topo = (await import(`@/lib/districts/${stateId}.json`)).default;

  const collection = feature(topo, topo.objects.districts);
  const { projection, width, height, corner } = fitToBox(collection);
  const path = geoPath(projection).digits(1);

  return {
    width,
    height,
    corner,
    project: toPoint(projection),
    districts: collection.features.map((district) => ({
      id: String(district.id),
      name: displayName(district.properties.name),
      d: path(district),
    })),
    districtIdForCoords(coords) {
      const match = collection.features.find((district) => geoContains(district, coords));
      return match ? String(match.id) : null;
    },
  };
}

/** districtId → { places, spots } for one state, visited districts only. */
const districtCache = new Map();

export function districtsWithPlaces(stateId) {
  const cached = districtCache.get(stateId);
  if (cached) return cached;

  const pending = (async () => {
    const map = await getStateMap(stateId);
    const inState = beenTo.filter((place) => stateIdOf(place) === stateId);
    return groupByKey(inState, (place) => map.districtIdForCoords(place.coords));
  })();

  districtCache.set(stateId, pending);
  return pending;
}
