// Server-only: projects country outlines to SVG path strings once, at build time.
// The browser only ever receives finished `d` strings and pin coords.
// Enforced, not just documented — see the note in india-districts.js.
import 'server-only';
import { geoContains, geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
// Natural Earth, India point of view (official border), Antarctica dropped.
// Regenerate with scripts/build-world-map.mjs.
import world from './world-countries.json';

const features = feature(world, world.objects.countries).features;
const collection = { type: 'FeatureCollection', features };

export const MAP_WIDTH = 1000;

// Natural Earth rather than Mercator, so Greenland stays smaller than Africa.
const projection = geoNaturalEarth1().fitWidth(MAP_WIDTH, collection);

export const MAP_HEIGHT = Math.ceil(geoPath(projection).bounds(collection)[1][1]);

// One decimal: integer coords are ~half the bytes but visibly step at 8x zoom.
const toPath = geoPath(projection).digits(1);

export const countries = features.map((f) => ({
  id: f.id ?? f.properties.name, // Bir Tawil, Akrotiri, Dhekelia and Guantanamo Bay have no ISO id
  name: f.properties.name,
  d: toPath(f),
}));

export function project(coords) {
  const [x, y] = projection(coords);
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

const featureById = new Map(features.map((f) => [f.id, f]));

export function isInCountry(countryId, coords) {
  const country = featureById.get(countryId);
  return Boolean(country) && geoContains(country, coords);
}
