// Regenerates the two files behind the India map:
//
//   app/lib/india-states.json     one TopoJSON of all states and UTs
//   app/lib/india-districts.json  { "<state LGD code>": <TopoJSON of that state's districts> }
//
// Source: Survey of India boundaries, republished by ramSeraph/indian_admin_boundaries as
// CC0 (attribute DataMeet and Survey of India). These are the official borders — Jammu &
// Kashmir includes Mirpur and Muzaffarabad and Ladakh runs up to 37.1°N, so the outline agrees
// with the India point-of-view world map built by build-world-map.mjs.
//
// Districts are simplified per state, at roughly one pixel of a 1000px-wide state map, so a
// small UT keeps its shape and a big state doesn't ship a needlessly heavy page. The districts
// file is only ever read on the server: a state page renders its own districts to path strings
// at build time, and nothing else reaches the browser.
//
// Run when the source or settings change (needs network):
//   npm i --no-save mapshaper@0.7.61 7zip-min
//   node scripts/build-india-map.mjs
import { createReadStream, createWriteStream, statSync } from 'node:fs';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import mapshaper from 'mapshaper';
import { unpack } from '7zip-min';

const RELEASE = 'https://github.com/ramSeraph/indian_admin_boundaries/releases/download';
const SOURCES = {
  states: `${RELEASE}/states/SOI_States.geojsonl.7z`,
  districts: `${RELEASE}/districts/SOI_Districts.geojsonl.7z`,
};
const OUT = {
  states: fileURLToPath(new URL('../app/lib/india-states.json', import.meta.url)),
  districts: fileURLToPath(new URL('../app/lib/india-districts.json', import.meta.url)),
};

// How much of India's state map survives simplification. 0.3% lands at ~27 KB brotli of path
// strings, about what the whole world map costs.
const STATE_SIMPLIFY = '0.3%';
// A state's districts are simplified to (state width in metres / this), i.e. ~0.8px of a
// 1000px-wide map, clamped so tiny UTs stay sharp and huge states stay light.
const DISTRICT_DETAIL = 1200;
const MIN_INTERVAL = 100;
const MAX_INTERVAL = 800;

const KB = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

const work = await mkdtemp(join(tmpdir(), 'india-map-'));

async function download(url, name) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${url}`);
  const archive = join(work, name);
  await writeFile(archive, Buffer.from(await res.arrayBuffer()));
  await new Promise((resolve, reject) => unpack(archive, work, (err) => (err ? reject(err) : resolve())));
  return archive.replace(/\.7z$/, '');
}

// The releases ship newline-delimited GeoJSON; mapshaper wants one FeatureCollection.
async function toFeatureCollection(geojsonl, name) {
  const out = join(work, name);
  const stream = createWriteStream(out);
  stream.write('{"type":"FeatureCollection","features":[');
  let first = true;
  for await (const line of createInterface({ input: createReadStream(geojsonl) })) {
    if (!line.trim()) continue;
    if (!first) stream.write(',');
    stream.write(line);
    first = false;
  }
  stream.write(']}');
  await new Promise((resolve) => stream.end(resolve));
  return out;
}

console.log('Downloading Survey of India boundaries…');
const [statesRaw, districtsRaw] = await Promise.all([
  download(SOURCES.states, 'SOI_States.geojsonl.7z'),
  download(SOURCES.districts, 'SOI_Districts.geojsonl.7z'),
]);
const statesInput = await toFeatureCollection(statesRaw, 'states.geojson');
const districtsInput = await toFeatureCollection(districtsRaw, 'districts.geojson');

// State_LGD 0 marks the four areas disputed between states. They're kept so the landmass has no
// holes, but they get no id, so nothing links to them.
console.log('Building states…');
await mapshaper.runCommands(
  [
    `-i "${statesInput}"`,
    `-each 'key = State_LGD > 0 ? String(State_LGD) : null, name = STATE_C'`,
    '-dissolve2 key copy-fields=name',
    `-simplify ${STATE_SIMPLIFY} weighted keep-shapes`,
    // Lakshadweep's largest island is under 5 km², so this threshold has to stay tiny or the
    // whole UT disappears from the map.
    '-filter-islands min-area=0.5km2 remove-empty',
    '-rename-layers states',
    `-o "${OUT.states}" format=topojson quantization=100000 id-field=key`,
  ].join(' '),
);
console.log(`  ${OUT.states} — ${KB(statSync(OUT.states).size)}`);

// Which states exist, and how wide each one is, so simplification can scale to it.
const districtsGeo = JSON.parse(await readFile(districtsInput, 'utf8'));
const extents = new Map();
for (const feature of districtsGeo.features) {
  const lgd = feature.properties.State_LGD;
  if (!lgd) continue; // inter-state disputed slivers have no districts worth a page
  const extent = extents.get(lgd) ?? { minX: 180, maxX: -180, minY: 90, maxY: -90 };
  JSON.stringify(feature.geometry.coordinates).replace(/\[(-?[\d.]+),(-?[\d.]+)\]/g, (match, lng, lat) => {
    extent.minX = Math.min(extent.minX, +lng);
    extent.maxX = Math.max(extent.maxX, +lng);
    extent.minY = Math.min(extent.minY, +lat);
    extent.maxY = Math.max(extent.maxY, +lat);
    return match;
  });
  extents.set(lgd, extent);
}

console.log(`Building districts for ${extents.size} states…`);
const districts = {};
for (const [lgd, extent] of [...extents].sort((a, b) => a[0] - b[0])) {
  // rough metres across, enough to pick a simplification interval
  const midLat = ((extent.minY + extent.maxY) / 2) * (Math.PI / 180);
  const width = (extent.maxX - extent.minX) * 111_320 * Math.cos(midLat);
  const interval = Math.round(Math.min(MAX_INTERVAL, Math.max(MIN_INTERVAL, width / DISTRICT_DETAIL)));
  const out = join(work, `districts-${lgd}.json`);
  await mapshaper.runCommands(
    [
      `-i "${districtsInput}"`,
      `-filter 'State_LGD === ${lgd}'`,
      // Territory India claims but doesn't administer has no LGD code — Mirpur, and one sliver
      // disputed between Ratlam and Mandsaur — so fall back to the name rather than emit a null id.
      `-each 'key = DISTRICT_L ? String(DISTRICT_L) : District_C, name = District_C'`,
      '-dissolve2 key copy-fields=name',
      `-simplify interval=${interval} keep-shapes`,
      '-filter-islands min-area=0.5km2 remove-empty',
      '-rename-layers districts',
      `-o "${out}" format=topojson quantization=1000000 id-field=key`,
    ].join(' '),
  );
  districts[lgd] = JSON.parse(await readFile(out, 'utf8'));
}

await writeFile(OUT.districts, JSON.stringify(districts));
console.log(`  ${OUT.districts} — ${KB(statSync(OUT.districts).size)} (server-only)`);
