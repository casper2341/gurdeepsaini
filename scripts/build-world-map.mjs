// Regenerates app/lib/world-countries.json, the country outlines behind the travel map.
//
// Source: Natural Earth 1:10m admin-0 countries, India point of view, so India's border matches the
// official Survey of India border (all of Jammu & Kashmir and Ladakh). Natural Earth only publishes
// point-of-view data at 1:10m, so it's simplified to about the detail world-atlas's 1:110m file had
// (~8k points, ~30 KB brotli of path strings on the map page).
//
// Run when the source or settings change (needs network):
//   npm i --no-save mapshaper@0.7.61
//   node scripts/build-world-map.mjs
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import mapshaper from 'mapshaper';

const SOURCE =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_admin_0_countries_ind.geojson';
const OUTPUT = fileURLToPath(new URL('../app/lib/world-countries.json', import.meta.url));

const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`Download failed: ${res.status} ${SOURCE}`);
const input = join(await mkdtemp(join(tmpdir(), 'world-map-')), 'countries.geojson');
await writeFile(input, Buffer.from(await res.arrayBuffer()));

await mapshaper.runCommands(
  [
    `-i "${input}"`,
    `-filter 'ADM0_A3 !== "ATA"'`,
    // ISO 3166-1 numeric ids, as world-atlas used ('356' = India). France and Norway only have ISO_N3_EH.
    `-each 'key = [ISO_N3, ISO_N3_EH].find(v => v && v !== "-99") || NAME, name = NAME'`,
    // Merges pieces that share an id: France + Clipperton I., Australia + its island territories.
    '-dissolve2 key copy-fields=name',
    // Bir Tawil, Akrotiri, Dhekelia and Guantanamo Bay have no ISO id.
    `-each 'key = isNaN(key) ? null : key'`,
    '-simplify 1.5% weighted keep-shapes',
    '-filter-islands min-area=2000km2 remove-empty',
    '-rename-layers countries',
    `-o "${OUTPUT}" format=topojson quantization=100000 id-field=key`,
  ].join(' '),
);

console.log(`Wrote ${OUTPUT}`);
