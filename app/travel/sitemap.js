import { places, travelUrl } from '@/data/travel';
import { BOUNDARIES_UPDATED, states } from '@/lib/india';

// Generated at /travel/sitemap.xml; proxy.js serves it as travel.gurdeepsaini.com/sitemap.xml.
//
// lastmod is derived, not stamped with the build time. A city page changes when its entry in
// travel.js does; a state page changes only when build-india-map.mjs regenerates the boundary
// files. Telling crawlers all 54 URLs changed on every deploy taught them to ignore the field.
export default function sitemap() {
  const boundaries = new Date(BOUNDARIES_UPDATED);
  // the map page lists every city, so it's as fresh as the most recently updated one
  const newestCity = places.length
    ? new Date(Math.max(...places.map((place) => new Date(place.updated))))
    : boundaries;

  return [
    { url: travelUrl, lastModified: newestCity, changeFrequency: 'monthly', priority: 1 },
    ...places.map((place) => ({
      url: `${travelUrl}/${place.slug}`,
      lastModified: new Date(place.updated),
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    { url: `${travelUrl}/india`, lastModified: boundaries, changeFrequency: 'monthly', priority: 0.8 },
    // The state maps change only when the boundary data does, and they carry less of my own
    // writing than a city guide, so they sit lower.
    ...states
      .filter((state) => state.id)
      .map((state) => ({
        url: `${travelUrl}/india/${state.slug}`,
        lastModified: boundaries,
        changeFrequency: 'yearly',
        priority: 0.5,
      })),
  ];
}
