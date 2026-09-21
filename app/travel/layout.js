import { profile } from '@/data/profile';
import { places, travelSiteName, travelUrl } from '@/data/travel';

const title = `Travels — ${profile.name}`;
const description = `The places ${profile.name} has lived in and travelled to: a comic-style world map with a city guide behind every pin — breweries, gardens, restaurants, markets and more.`;

export const metadata = {
  metadataBase: new URL(travelUrl),
  title: {
    absolute: title, // `default` would pick up the root layout's "%s — Gurdeep Saini" too
    template: `%s — ${profile.name}'s travels`,
  },
  description,
  keywords: [profile.name, 'travel map', 'city guide', ...places.map((place) => place.city)],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: travelUrl,
    siteName: travelSiteName,
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    creator: '@casper2341',
  },
  category: 'travel',
};

export default function TravelLayout({ children }) {
  return children;
}
