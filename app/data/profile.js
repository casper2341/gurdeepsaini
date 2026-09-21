// Single source of truth for site content — pulled from Gurdeep's resume.

// Canonical production URL. Override with NEXT_PUBLIC_SITE_URL at build time.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://gurdeepsaini.com'
).replace(/\/$/, '');

// The portfolio's routes, in nav order. PortfolioShell renders these as links and sitemap.js maps
// them to URLs — one list, so adding a page can't leave it out of the sitemap.
//
// `updated` is the last time the page's copy meaningfully changed, in YYYY-MM-DD. It's the sitemap's
// lastmod: stamping every URL with the build time told crawlers the field carries no information.
// Bump it by hand when you rewrite a page; leaving it stale is better than a date that lies upward.
export const routes = [
  { href: '/', label: 'Home', updated: '2026-09-21', changeFrequency: 'monthly', priority: 1 },
  { href: '/about', label: 'About', updated: '2026-09-19', changeFrequency: 'yearly', priority: 0.8 },
  { href: '/experience', label: 'Experience', updated: '2026-09-19', changeFrequency: 'yearly', priority: 0.8 },
  { href: '/projects', label: 'Projects', updated: '2026-09-19', changeFrequency: 'yearly', priority: 0.8 },
  { href: '/contact', label: 'Contact', updated: '2026-09-19', changeFrequency: 'yearly', priority: 0.8 },
];

export const profile = {
  name: 'Gurdeep Saini',
  role: 'Android Developer',
  company: 'MoneyView',
  location: 'Bengaluru, India',
  email: 'codegurdeep@gmail.com',
  // No phone number here on purpose: nothing renders it, it's the first thing scrapers harvest,
  // and `telephone` was deliberately left out of the JSON-LD too. Email is the contact channel.
  twitter: '@casper2341', // the `creator` on every page's twitter card
  github: 'https://github.com/casper2341',
  linkedin: 'https://www.linkedin.com/in/gurdeep-saini-349a2227b/',
  tagline: 'I ship production Android for fintech — Kotlin, Compose, and the kind of details users never notice but always feel.',
};

export const typewriterPhrases = [
  "I'm Gurdeep Saini",
  'I build Android apps',
  'I ship fintech at scale',
  'I read fiction for fun',
];

// Headline numbers — the "wow" panel, Apple-style.
export const stats = [
  { value: '44%', label: 'Smaller APK', detail: '79.1MB → 44MB via R8, vector drawables & AAB' },
  { value: '₹400Cr+', label: 'Loans disbursed', detail: 'Through loan products I helped build' },
  { value: '2 lines', label: 'To integrate', detail: 'A reusable feedback component across 5+ flows' },
  { value: '10+', label: 'Tables to Room', detail: 'Migrated ORM tables with Coroutines & Flows' },
];

// "What I build" comic panels for the home page.
export const panels = [
  {
    kicker: 'Performance',
    title: 'Made the app 44% lighter',
    body: 'Cut the APK from 79.1MB to 44MB with ProGuard/R8, vector drawables and an App Bundle migration — lifting Play Store ranking and install rates.',
    tag: 'R8 · AAB · Vectors',
  },
  {
    kicker: 'Architecture',
    title: 'A referral engine that scales',
    body: 'Architected a multi-product referral system on an SDUI framework with Compose, Retrofit, Hilt and AppsFlyer — so campaigns roll out fast and stay compliant.',
    tag: 'SDUI · Compose · Hilt',
  },
  {
    kicker: 'Cross-platform',
    title: 'One codebase, two platforms',
    body: 'Led a Kotlin Multiplatform migration sharing business logic across Android and iOS, with Koin for DI and Ktor as a unified API layer.',
    tag: 'KMP · Koin · Ktor',
  },
  {
    kicker: 'Craft',
    title: 'Offline-first, backward-compatible',
    body: 'Built Add/Edit Accounts on Material 3 with Room for offline persistence, and permission-free PDF downloads via WorkManager, safe back to Android 9.',
    tag: 'Room · Material 3 · WorkManager',
  },
];

export const skills = [
  { group: 'Languages', items: ['Kotlin', 'Java'] },
  { group: 'Architecture', items: ['MVVM', 'MVI', 'MVP', 'Clean Architecture'] },
  { group: 'Jetpack', items: ['Compose', 'Coroutines', 'Flows', 'Room', 'WorkManager', 'Navigation', 'ViewModel', 'LiveData'] },
  { group: 'DI', items: ['Hilt', 'Dagger', 'Koin'] },
  { group: 'Networking', items: ['Retrofit', 'Ktor', 'OkHttp', 'RESTful APIs'] },
  { group: 'Firebase', items: ['Auth', 'Firestore', 'Remote Config', 'Analytics', 'Crashlytics', 'FCM'] },
  { group: 'Cross-platform', items: ['Kotlin Multiplatform'] },
  { group: 'UI & Design', items: ['Material 3', 'Lottie', 'Glide', 'Custom Views', 'XML'] },
  { group: 'Tools & DevOps', items: ['Android Studio', 'Gradle', 'ProGuard/R8', 'Git', 'CI/CD', 'Play Store'] },
];

export const experience = [
  {
    role: 'Android Developer',
    company: 'MoneyView',
    period: 'Feb 2023 — Present',
    location: 'Bengaluru, India',
    impact: [
      'Reduced APK size 44% (79.1MB → 44MB) with ProGuard/R8, vector drawables and AAB migration, improving Play Store ranking and downloads.',
      'Architected a scalable multi-product referral system using an SDUI framework, Compose, Retrofit, Hilt and AppsFlyer — accelerating campaign rollout with fintech compliance.',
      'Built loan products with Compose, Kotlin, MVVM and Firebase contributing to ₹400+ Cr in loan disbursals.',
      'Engineered a reusable feedback component with generic REST APIs, cutting integration to ~2 lines across 5+ flows.',
      'Migrated 10+ ORM tables to Room with Coroutines/Flows, a Repository pattern and indexing for faster queries.',
      'Led a Kotlin Multiplatform migration sharing business logic across Android/iOS using Koin and Ktor.',
    ],
    stack: ['Kotlin', 'Compose', 'KMP', 'Hilt', 'Room', 'Ktor'],
  },
];

export const education = {
  school: 'Vellore Institute of Technology, Bhopal',
  degree: 'B.Tech, Computer Science Engineering',
  detail: 'CGPA 8.3 / 10.0',
  period: 'July 2019 — June 2023',
};

export const projects = [
  {
    title: 'Slate Board',
    blurb: 'A playful drawing canvas for kids built with a custom Android UI in Kotlin.',
    stack: ['Kotlin', 'Canvas'],
    href: 'https://github.com/casper2341/Slate_Board',
  },
  {
    title: 'Doctor Patient Appointment App',
    blurb: 'Appointment booking built with Compose, Firebase (Auth, Firestore, Remote Config), Hilt and MVVM, following Material Design 3.',
    stack: ['Compose', 'Firebase', 'Hilt', 'MVVM'],
    href: 'https://github.com/casper2341/GuriDocPat',
  },
  {
    title: 'GenAI Resume Enhancement App',
    blurb: 'AI resume analyzer using the Gemini API with Firebase Remote Config for dynamic LLM updates, PDF parsing and a Compose UI.',
    stack: ['Gemini API', 'Compose', 'Remote Config', 'PDF'],
    href: 'https://github.com/casper2341/GuriResumeRewrite',
  },
  {
    title: 'Room CRUD',
    blurb: 'A Room database proof-of-concept covering CRUD operations, migrations and a Repository pattern in Kotlin.',
    stack: ['Kotlin', 'Room', 'Coroutines'],
    href: 'https://github.com/casper2341/GuriRoom',
  },
  {
    title: 'Finance Manager',
    blurb: 'A personal finance and expense tracking app built in Kotlin with a clean, offline-friendly architecture.',
    stack: ['Kotlin', 'Android'],
    href: 'https://github.com/casper2341/GuriFinanceManager',
  },
  {
    title: 'Movies (TMDB)',
    blurb: 'A movie browsing app powered by the TMDB API — search, details and paginated lists in Kotlin.',
    stack: ['Kotlin', 'TMDB API', 'Retrofit'],
    href: 'https://github.com/casper2341/GuriMoviesTMDB',
  },
  {
    title: 'WorkManager Demo',
    blurb: 'A focused proof-of-concept for background and deferrable work using Android WorkManager.',
    stack: ['Kotlin', 'WorkManager'],
    href: 'https://github.com/casper2341/GuriWorkManager',
  },
  {
    title: 'ViralVault',
    blurb: 'A content vault experiment exploring modern Android UI and state management in Kotlin.',
    stack: ['Kotlin', 'Compose'],
    href: 'https://github.com/casper2341/ViralVault',
  },
  {
    title: 'Video Call App',
    blurb: 'A real-time video calling proof-of-concept built on Android in Kotlin.',
    stack: ['Kotlin', 'WebRTC'],
    href: 'https://github.com/casper2341/GuriVidCall',
  },
  {
    title: 'Firestore Realtime',
    blurb: 'A hands-on demo of real-time data sync with Cloud Firestore on Android.',
    stack: ['Kotlin', 'Firestore'],
    href: 'https://github.com/casper2341/GuriFireStore',
  },
  {
    title: 'Firebase Sign-In',
    blurb: 'Authentication flows with Firebase Auth and Google Sign-In in Kotlin.',
    stack: ['Kotlin', 'Firebase Auth', 'OAuth'],
    href: 'https://github.com/casper2341/GuriFirebaseSignIn',
  },
  {
    title: 'Remote Config Demo',
    blurb: 'Feature flags and remote-driven UI using Firebase Remote Config on Android.',
    stack: ['Kotlin', 'Remote Config'],
    href: 'https://github.com/casper2341/GuriRemoteConfig',
  },
  {
    title: 'Download Manager',
    blurb: 'A permission-free file download proof-of-concept for modern Android.',
    stack: ['Kotlin', 'WorkManager'],
    href: 'https://github.com/casper2341/GuriDownload',
  },
  {
    title: 'Dynamic App Icon',
    blurb: 'A demo for switching Android launcher icons at runtime with activity-alias.',
    stack: ['Kotlin', 'Android'],
    href: 'https://github.com/casper2341/GuriDynamicIcon',
  },
  {
    title: 'Service Locator',
    blurb: 'A lightweight service-locator dependency-injection pattern implemented in Kotlin.',
    stack: ['Kotlin', 'DI'],
    href: 'https://github.com/casper2341/GuriServiceLocator',
  },
  {
    title: 'Custom Canvas',
    blurb: 'Custom drawing and rendering with the Android Canvas API in Kotlin.',
    stack: ['Kotlin', 'Canvas'],
    href: 'https://github.com/casper2341/GuriCanvas',
  },
  {
    title: 'Room Database',
    blurb: 'A focused example of local persistence with the Room ORM on Android.',
    stack: ['Kotlin', 'Room'],
    href: 'https://github.com/casper2341/Room',
  },
  {
    title: 'Quizzy',
    blurb: 'A quiz app with scoring and question flows, built in Kotlin.',
    stack: ['Kotlin', 'Android'],
    href: 'https://github.com/casper2341/GuriQuizzy',
  },
  {
    title: 'Quizzyy',
    blurb: 'An early quiz app exploring Android fundamentals and UI in Kotlin.',
    stack: ['Kotlin', 'Android'],
    href: 'https://github.com/casper2341/Quizzyy',
  },
  {
    title: 'Weather App',
    blurb: 'A weather app fetching live conditions and forecasts via a REST API in Kotlin.',
    stack: ['Kotlin', 'REST API'],
    href: 'https://github.com/casper2341/WeatherApp',
  },
  {
    title: '7 Minute Workout',
    blurb: 'A guided 7-minute workout app with timers and exercise flow, built in Kotlin.',
    stack: ['Kotlin', 'Android'],
    href: 'https://github.com/casper2341/7MinWorkOut',
  },
  {
    title: 'CalSi',
    blurb: 'A clean, simple calculator app built in Kotlin.',
    stack: ['Kotlin', 'Android'],
    href: 'https://github.com/casper2341/CalSi',
  },
  {
    title: "Let's Connect",
    blurb: 'A social connect app built in Java, exploring Android fundamentals and networking.',
    stack: ['Java', 'Android'],
    href: 'https://github.com/casper2341/Let-s-Connect',
  },
  {
    title: 'Blockchain Project',
    blurb: 'A blockchain experiment built in JavaScript, exploring blocks, hashing and chaining.',
    stack: ['JavaScript', 'Blockchain'],
    href: 'https://github.com/casper2341/BlockChain_Project',
  },
];
