import './globals.css';
import JsonLd from '@/components/json-ld';
import { comic, comicDark } from '@/data/theme';
import { profile, siteUrl } from '@/data/profile';

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
    creator: profile.twitter,
  },
  icons: {
    icon: '/icon.svg',
  },
  category: 'technology',
};

export const viewport = {
  // --paper in each theme. The old fixed '#0a0a0a' matched neither palette.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: comic.paper },
    { media: '(prefers-color-scheme: dark)', color: comicDark.paper },
  ],
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

// Applies the theme before first paint. Without it, pages paint light and flip to dark once React
// hydrates. ThemeToggle reads the class this sets.
//
// Order of precedence: an explicit choice the visitor made here, then the OS setting, then dark.
// A visitor on a light-mode device used to get dark anyway, because a missing localStorage entry
// read the same as "not light".
const themeScript = `try{var s=localStorage.getItem('theme');document.body.classList.toggle('dark-theme',s?s==='dark':!matchMedia('(prefers-color-scheme: light)').matches)}catch(e){document.body.classList.add('dark-theme')}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* the theme script changes body's class before React hydrates */}
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        <JsonLd data={jsonLd} />
      </body>
    </html>
  );
}
