// Server-only. This is the module that imports the 1.7 MB district file, so only the two places
// that actually draw districts — the state map component and the state page — pull it into their
// server bundle. Nothing here is ever reachable from a client component, so the JSON never lands
// in a browser bundle at all.
import { geoContains, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import districtsTopo from './india-districts.json';
import { displayName, fitToBox, toPoint } from './india';
import { beenTo, groupByKey, stateIdOf } from './india-places';

// Each state gets its own projection fitted to itself, so every state map fills the same frame.
// Cached because a page and its components both ask for it.
const stateMaps = new Map();

export function getStateMap(stateId) {
  if (stateMaps.has(stateId)) return stateMaps.get(stateId);

  const topo = districtsTopo[stateId];
  if (!topo) {
    // The two data files are regenerated independently, so this is worth failing loudly on rather
    // than returning null for a caller to dereference.
    throw new Error(`india-districts.js: no district data for state '${stateId}'`);
  }

  const collection = feature(topo, topo.objects.districts);
  const { projection, width, height, corner } = fitToBox(collection);
  const path = geoPath(projection).digits(1);

  const map = {
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

  stateMaps.set(stateId, map);
  return map;
}

export const hasDistricts = (stateId) => Boolean(districtsTopo[stateId]);

/** districtId → { places, spots } for one state, visited districts only. */
const districtCache = new Map();

export function districtsWithPlaces(stateId) {
  if (districtCache.has(stateId)) return districtCache.get(stateId);

  const map = getStateMap(stateId);
  const inState = beenTo.filter((place) => stateIdOf(place) === stateId);
  const grouped = groupByKey(inState, (place) => map.districtIdForCoords(place.coords));

  districtCache.set(stateId, grouped);
  return grouped;
}
