import { places, travelUrl } from '@/data/travel';
import { states } from '@/lib/india';

// Generated at /travel/sitemap.xml; proxy.js serves it as travel.gurdeepsaini.com/sitemap.xml.
export default function sitemap() {
  const lastModified = new Date();

  return [
    { url: travelUrl, lastModified, changeFrequency: 'monthly', priority: 1 },
    ...places.map((place) => ({
      url: `${travelUrl}/${place.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    { url: `${travelUrl}/india`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    // The state maps change only when the boundary data does, and they carry less of my own
    // writing than a city guide, so they sit lower.
    ...states
      .filter((state) => state.id)
      .map((state) => ({
        url: `${travelUrl}/india/${state.slug}`,
        lastModified,
        changeFrequency: 'yearly',
        priority: 0.5,
      })),
  ];
}
