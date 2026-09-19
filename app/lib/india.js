// Server-only, and the mirror of world.js: projects India's states to SVG path strings at build
// time, so the browser only ever receives finished `d` strings.
//
// The district half lives in india-districts.js, which imports the 1.7 MB district file. Keeping it
// out of here means routes that only want state paths or slugs — the sitemap, the /india OG card —
// don't drag that file into their server bundle.
import { geoConicConformal, geoContains, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
// Survey of India boundaries — the official border, including the full claimed extent of Jammu &
// Kashmir and Ladakh. Regenerate both files with scripts/build-india-map.mjs.
import statesTopo from './india-states.json';

// Lambert conformal conic with parallels either side of the country, the standard choice for India.
// Mercator would stretch Ladakh against Kerala.
const newProjection = () => geoConicConformal().parallels([12, 32]).rotate([-82, 0]);

// Maps are fitted into a square and then shifted to the origin, because MapViewport renders
// viewBox="0 0 width height" and its pan clamp assumes the content exactly fills that box.
const BOX = 1000;
// Without this the outline lands exactly on the viewBox edge and non-scaling-stroke borders get cut
// in half along every extremity — India's south edge is Great Nicobar, its west edge Gujarat's tip.
const PAD = 4;

const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

// Walks every projected vertex once and reports which corner of the box has the most empty space,
// so the zoom controls can sit somewhere that isn't over land. A fixed corner can't work: the
// emptiest one differs for India and for each of the 36 states.
function emptiestCorner(collection, projection, width, height) {
  const corners = [
    [0, 0],
    [width, 0],
    [0, height],
    [width, height],
  ];
  const nearest = [Infinity, Infinity, Infinity, Infinity];

  const visit = (coords) => {
    if (typeof coords[0] === 'number') {
      const point = projection(coords);
      if (!point) return;
      for (let i = 0; i < corners.length; i += 1) {
        const distance = Math.hypot(point[0] - corners[i][0], point[1] - corners[i][1]);
        if (distance < nearest[i]) nearest[i] = distance;
      }
      return;
    }
    for (const part of coords) visit(part);
  };
  for (const shape of collection.features) visit(shape.geometry.coordinates);

  let best = 0;
  for (let i = 1; i < nearest.length; i += 1) if (nearest[i] > nearest[best]) best = i;
  return CORNERS[best];
}

export function fitToBox(collection) {
  const projection = newProjection().fitSize([BOX - PAD * 2, BOX - PAD * 2], collection);
  const [[x0, y0], [x1, y1]] = geoPath(projection).bounds(collection);
  const [tx, ty] = projection.translate();
  projection.translate([tx - x0 + PAD, ty - y0 + PAD]);

  const width = Math.ceil(x1 - x0) + PAD * 2;
  const height = Math.ceil(y1 - y0) + PAD * 2;
  return { projection, width, height, corner: emptiestCorner(collection, projection, width, height) };
}

const round = (value) => Math.round(value * 10) / 10;
export const toPoint = (projection) => (coords) => {
  const [x, y] = projection(coords);
  return { x: round(x), y: round(y) };
};

// The source names are ALL CAPS ASCII: 'BENGALURU URBAN', 'JAMMU AND KASHMIR', 'ANDAMAN & NICOBAR'.
const MINOR_WORDS = new Set(['and', 'of', 'the']);
// Survey of India keeps some older spellings; these are the ones that read as mistakes today.
const NAME_FIXES = {
  AHMADABAD: 'Ahmedabad',
  BADGAM: 'Budgam',
  SHUPIYAN: 'Shopian',
  PUNCH: 'Poonch',
  BARAMULA: 'Baramulla',
};

function titleCase(name) {
  let isFirst = true;
  // matching only letters leaves '(', '&' and '-' alone, so 'DISPUTED (RATLAM & MANDSAUR)' works
  return name.toLowerCase().replace(/[a-z']+/g, (word) => {
    const cased = !isFirst && MINOR_WORDS.has(word) ? word : word[0].toUpperCase() + word.slice(1);
    isFirst = false;
    return cased;
  });
}

export const displayName = (name) => NAME_FIXES[name] ?? titleCase(name);

export const toSlug = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const indiaCollection = feature(statesTopo, statesTopo.objects.states);
const india = fitToBox(indiaCollection);

export const INDIA_SIZE = { width: india.width, height: india.height, corner: india.corner };
export const projectIndia = toPoint(india.projection);

const indiaPath = geoPath(india.projection).digits(1);

// One geometry has no id: the slivers disputed between states. It stays on the map so the
// landmass has no holes, but it gets no name, no slug and no link.
export const states = indiaCollection.features
  .map((state) => {
    const name = state.id ? displayName(state.properties.name) : null;
    // slug from the display name, so a NAME_FIXES entry can never make the two disagree
    return { id: state.id ? String(state.id) : null, name, slug: name ? toSlug(name) : null, d: indiaPath(state) };
  })
  .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));

const stateBySlug = new Map(states.filter((state) => state.slug).map((state) => [state.slug, state]));
export const getState = (slug) => stateBySlug.get(slug);

// Roughly 11 km. Enough to recover a coastal tip that simplification shaved off, small enough that
// a genuinely wrong coordinate still reports nothing.
const NEAR_DEGREES = 0.1;

function nearestVertexDistance(coords, [lng, lat]) {
  let nearest = Infinity;
  const visit = (part) => {
    if (typeof part[0] === 'number') {
      const distance = Math.hypot(part[0] - lng, part[1] - lat);
      if (distance < nearest) nearest = distance;
      return;
    }
    for (const child of part) visit(child);
  };
  visit(coords);
  return nearest;
}

export function stateIdForCoords(coords) {
  const inside = indiaCollection.features.find((state) => state.id && geoContains(state, coords));
  if (inside) return String(inside.id);

  // The outlines are simplified to 0.3%, which shaves coastal tips: Kanyakumari sits outside every
  // state. Fall back to the nearest state by ring VERTEX — by centroid it would answer Kerala.
  let bestId = null;
  let bestDistance = Infinity;
  for (const state of indiaCollection.features) {
    if (!state.id) continue;
    const distance = nearestVertexDistance(state.geometry.coordinates, coords);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestId = String(state.id);
    }
  }
  return bestDistance <= NEAR_DEGREES ? bestId : null;
}
