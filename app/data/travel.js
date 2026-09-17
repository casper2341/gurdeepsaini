// Single source of truth for travel.gurdeepsaini.com — the map, city pages,
// sitemap and OG images all read from here. Adding a city = appending one object.

// Canonical travel URL. Override with NEXT_PUBLIC_TRAVEL_URL at build time.
export const travelUrl = (
  process.env.NEXT_PUBLIC_TRAVEL_URL || 'https://travel.gurdeepsaini.com'
).replace(/\/$/, '');

export const travelSiteName = 'Gurdeep Saini · Travels';

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
// Privacy: these would narrow down where you live now, so the current home city can't use them.
const homeRevealingCategories = new Set(['residential', 'stays']);
for (const place of places) {
  if (!/^\d{3}$/.test(place.countryId)) {
    throw new Error(`travel.js: ${place.slug} countryId must be ISO numeric like '356', got '${place.countryId}'`);
  }
  if (!statusLabels[place.status]) {
    throw new Error(`travel.js: ${place.slug} has unknown status '${place.status}'`);
  }
  const isCurrentHome = place.status === 'lived' && !place.until;
  for (const spot of place.spots) {
    if (!categoryIds.has(spot.category)) {
      throw new Error(`travel.js: ${place.slug} → ${spot.name} has unknown category '${spot.category}'`);
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

export function mapsHref(spot, place) {
  if (spot.mapUrl) return spot.mapUrl;
  const query = [spot.name, spot.area, place.city].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
