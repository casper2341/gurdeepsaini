// Server-only: projects world-atlas country outlines to SVG path strings once, at
// build time. The browser only ever receives finished `d` strings and pin coords.
import { geoContains, geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import atlas from 'world-atlas/countries-110m.json';

const ANTARCTICA = '010';

const features = feature(atlas, atlas.objects.countries).features.filter((f) => f.id !== ANTARCTICA);
const collection = { type: 'FeatureCollection', features };

export const MAP_WIDTH = 1000;

// Natural Earth rather than Mercator, so Greenland stays smaller than Africa.
const projection = geoNaturalEarth1().fitWidth(MAP_WIDTH, collection);

export const MAP_HEIGHT = Math.ceil(geoPath(projection).bounds(collection)[1][1]);

// One decimal: integer coords are ~half the bytes but visibly step at 8x zoom.
const toPath = geoPath(projection).digits(1);

export const countries = features.map((f) => ({
  id: f.id ?? f.properties.name, // N. Cyprus, Somaliland and Kosovo have no ISO id
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
