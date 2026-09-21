// Single source of truth for travel.gurdeepsaini.com — the map, city pages,
// sitemap and OG images all read from here. Adding a city = appending one object.
import { profile } from '@/data/profile';

// Canonical travel URL. Override with NEXT_PUBLIC_TRAVEL_URL at build time.
export const travelUrl = (
  process.env.NEXT_PUBLIC_TRAVEL_URL || 'https://travel.gurdeepsaini.com'
).replace(/\/$/, '');

export const travelSiteName = 'Gurdeep Saini · Travels';

// A spot is: { name, category, area, note, rating, mapUrl, photo, tags } — and nothing else, since
// an unknown key is rejected below rather than silently ignored. Only `name` and `category` are
// required; the rest may be null.
//
// `schema` is the schema.org type each spot gets in the city page's JSON-LD.
// `residential` and `stays` are only for cities you've left (enforced below), and never name a
// building, street or PG.
export const categories = [
  { id: 'breweries', label: 'Breweries & taprooms', schema: 'Brewery' },
  { id: 'restaurants', label: 'Restaurants', schema: 'Restaurant' },
  { id: 'cafes', label: 'Cafés & bakeries', schema: 'CafeOrCoffeeShop' },
  { id: 'street-food', label: 'Street food', schema: 'FoodEstablishment' },
  { id: 'nightlife', label: 'Bars & nightlife', schema: 'BarOrPub' },
  { id: 'gardens', label: 'Gardens & parks', schema: 'Park' },
  { id: 'lakes', label: 'Lakes & waterfronts', schema: 'BodyOfWater' },
  { id: 'malls', label: 'Malls & shopping', schema: 'ShoppingCenter' },
  { id: 'markets', label: 'Markets & bazaars', schema: 'Place' },
  { id: 'residential', label: 'Neighbourhoods I lived in', schema: 'Place' },
  { id: 'landmarks', label: 'Landmarks & monuments', schema: 'LandmarksOrHistoricalBuildings' },
  { id: 'temples', label: 'Temples & worship', schema: 'PlaceOfWorship' },
  { id: 'museums', label: 'Museums & galleries', schema: 'Museum' },
  { id: 'bookstores', label: 'Bookstores', schema: 'BookStore' },
  { id: 'viewpoints', label: 'Viewpoints & sunsets', schema: 'TouristAttraction' },
  { id: 'trails', label: 'Trails & hikes', schema: 'TouristAttraction' },
  { id: 'daytrips', label: 'Day trips nearby', schema: 'TouristDestination' },
  { id: 'stays', label: 'Where I stayed', schema: 'LodgingBusiness' },
  { id: 'workspots', label: 'Work spots', schema: 'Place' },
  { id: 'venues', label: 'Cinemas & venues', schema: 'EventVenue' },
];

export const places = [
  {
    slug: 'bengaluru',
    city: 'Bengaluru',
    country: 'India',
    countryId: '356', // ISO 3166-1 NUMERIC, as the map data uses — not 'IN'
    coords: [77.5946, 12.9716], // [lng, lat] — d3 order, NOT lat/lng
    status: 'lived', // lived | visited | transit | wishlist
    since: '2023-02', // add `until: 'YYYY-MM'` once you've moved out
    updated: '2026-09-19', // YYYY-MM-DD, the sitemap's lastmod — bump when you add or edit spots
    blurb: 'Where I moved for MoneyView.',
    spots: [
      {
        name: 'Toit',
        category: 'breweries',
        area: 'Indiranagar',
        note: 'The Tintin-adjacent one. Basmati Blonde.',
        rating: 5,
        mapUrl: null, // null → a Google Maps search for name + area + city
        photo: null, // '/travel/blr/toit.jpg' later
        tags: null, // free-form chips under the note, e.g. ['rooftop', 'no bookings']
      },
    ],
  },
];

export const statusLabels = {
  lived: 'Lived here',
  visited: 'Visited',
  transit: 'Passed through',
  wishlist: 'On the wishlist',
};

// Fail the build on data mistakes that would otherwise break silently.
const categoryIds = new Set(categories.map((category) => category.id));
// Every key a spot may carry. A misspelled one — `tag` for `tags`, `not` for `note` — is otherwise
// just an ignored property: the field renders as missing and nothing says why.
const spotKeys = new Set(['name', 'category', 'area', 'note', 'rating', 'mapUrl', 'photo', 'tags']);
// Privacy: these would narrow down where you live now, so the current home city can't use them.
const homeRevealingCategories = new Set(['residential', 'stays']);
// City pages sit at the travel host root, so a slug can't collide with a page that lives there too.
const reservedSlugs = new Set(['india']);
for (const place of places) {
  if (reservedSlugs.has(place.slug)) {
    throw new Error(`travel.js: '${place.slug}' is a reserved route on the travel site — pick another slug`);
  }
  if (!/^\d{3}$/.test(place.countryId)) {
    throw new Error(`travel.js: ${place.slug} countryId must be ISO numeric like '356', got '${place.countryId}'`);
  }
  if (!statusLabels[place.status]) {
    throw new Error(`travel.js: ${place.slug} has unknown status '${place.status}'`);
  }
  // The sitemap reads this as lastmod; a missing one would silently become an Invalid Date.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(place.updated ?? '') || Number.isNaN(Date.parse(place.updated))) {
    throw new Error(`travel.js: ${place.slug} needs an 'updated' date as YYYY-MM-DD, got '${place.updated}'`);
  }
  const isCurrentHome = place.status === 'lived' && !place.until;
  for (const spot of place.spots) {
    for (const key of Object.keys(spot)) {
      if (!spotKeys.has(key)) {
        throw new Error(
          `travel.js: ${place.slug} → ${spot.name} has unknown field '${key}' — known fields are ${[...spotKeys].join(', ')}`,
        );
      }
    }
    if (!categoryIds.has(spot.category)) {
      throw new Error(`travel.js: ${place.slug} → ${spot.name} has unknown category '${spot.category}'`);
    }
    if (spot.tags != null && (!Array.isArray(spot.tags) || spot.tags.some((tag) => typeof tag !== 'string'))) {
      throw new Error(`travel.js: ${place.slug} → ${spot.name} has a 'tags' that isn't an array of strings`);
    }
    if (isCurrentHome && homeRevealingCategories.has(spot.category)) {
      throw new Error(
        `travel.js: ${place.slug} → ${spot.name} uses '${spot.category}', which isn't allowed for your current home city`,
      );
    }
  }
}

const placeBySlug = new Map(places.map((place) => [place.slug, place]));
export const getPlace = (slug) => placeBySlug.get(slug);

// Wishlist entries get a pin but don't count as "been there".
const beenTo = places.filter((place) => place.status !== 'wishlist');
export const visitedCountryIds = [...new Set(beenTo.map((place) => place.countryId))];

export const totals = {
  countries: visitedCountryIds.length,
  cities: beenTo.length,
  spots: beenTo.reduce((sum, place) => sum + place.spots.length, 0),
};

// Spots grouped in `categories` order, empty groups dropped.
export function spotsByCategory(place) {
  return categories
    .map((category) => ({ ...category, spots: place.spots.filter((spot) => spot.category === category.id) }))
    .filter((group) => group.spots.length > 0);
}

export function adjacentPlaces(slug) {
  const i = places.findIndex((place) => place.slug === slug);
  return { prev: places[i - 1] ?? null, next: places[i + 1] ?? null };
}

export const plural = (count, one, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;

// '2023-02' → 'Feb 2023'
export function formatMonth(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1)).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// 'Lived here since Feb 2023' · 'Lived here Feb 2021 – Jan 2023' · 'Visited in Dec 2024'
export function statusLine(place) {
  const label = statusLabels[place.status];
  if (!place.since) return label;
  if (place.status !== 'lived') return `${label} in ${formatMonth(place.since)}`;
  return place.until
    ? `${label} ${formatMonth(place.since)} – ${formatMonth(place.until)}`
    : `${label} since ${formatMonth(place.since)}`;
}

// One shape for every travel page's metadata. The four routes each hand-built this, which is ~15
// lines apiece and one forgotten `canonical` away from a duplicate-content problem. `path` is
// host-relative ('/', '/india', '/bengaluru') — the travel layout's metadataBase resolves it.
export function travelMetadata({ title, description, path }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: path,
      siteName: travelSiteName,
      title,
      description,
    },
    twitter: { card: 'summary_large_image', title, description, creator: profile.twitter },
  };
}

export function mapsHref(spot, place) {
  if (spot.mapUrl) return spot.mapUrl;
  const query = [spot.name, spot.area, place.city].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
