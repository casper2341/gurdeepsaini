import { places, travelUrl } from '../data/travel';

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
  ];
}
