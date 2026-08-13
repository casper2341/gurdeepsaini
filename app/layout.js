import './globals.css';
import { profile, siteUrl } from './data/profile';

const description =
  'Gurdeep Saini is an Android Developer at MoneyView in Bengaluru, building production fintech apps with Kotlin, Jetpack Compose, Kotlin Multiplatform and Clean Architecture.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description,
  keywords: [
    'Gurdeep Saini',
    'Android Developer',
    'Kotlin',
    'Jetpack Compose',
    'Kotlin Multiplatform',
    'Android Engineer',
    'Fintech',
    'MoneyView',
    'Bengaluru',
    'Mobile Developer',
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: profile.name,
    title: `${profile.name} — ${profile.role}`,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.role}`,
    description,
    creator: '@casper2341',
  },
  icons: {
    icon: '/icon.svg',
  },
  category: 'technology',
};

export const viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  image: `${siteUrl}/icon.svg`,
  worksFor: {
    '@type': 'Organization',
    name: profile.company,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bengaluru',
    addressCountry: 'IN',
  },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: [
    'Android Development',
    'Kotlin',
    'Jetpack Compose',
    'Kotlin Multiplatform',
    'Clean Architecture',
    'Fintech',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
