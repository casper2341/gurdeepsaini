// Single source of truth for site content — pulled from Gurdeep's resume.

export const profile = {
  name: 'Gurdeep Saini',
  role: 'Android Developer',
  company: 'MoneyView',
  location: 'Bengaluru, India',
  email: 'codegurdeep@gmail.com',
  phone: '[removed]',
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
    title: 'Doctor Patient Appointment App',
    blurb: 'Appointment booking built with Compose, Firebase (Auth, Firestore, Remote Config), Hilt and MVVM, following Material Design 3.',
    stack: ['Compose', 'Firebase', 'Hilt', 'MVVM'],
    href: 'https://github.com/casper2341/GuriDocPat',
  },
  {
    title: 'GenAI Resume Enhancement App',
    blurb: 'AI resume analyzer using the Gemini API with Firebase Remote Config for dynamic LLM updates, PDF parsing and a Compose UI.',
    stack: ['Gemini API', 'Compose', 'Remote Config', 'PDF'],
    href: 'https://github.com/casper2341/GuriResumeRewite',
  },
  {
    title: 'Android POC Collection',
    blurb: 'A practical set of Android proof-of-concepts: Room CRUD with migrations, Remote Config feature flags, real-time Firestore and Google Sign-In.',
    stack: ['Room', 'Firestore', 'Remote Config', 'OAuth'],
    href: 'https://github.com/casper2341/GuriRoom',
  },
];
