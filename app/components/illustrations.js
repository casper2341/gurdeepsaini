// Inline, dependency-free comic illustrations. Colors pull from CSS vars so they
// track light/dark themes automatically.

// A comic-styled phone showing an app screen — hero focal point.
export function PhoneMock() {
  return (
    <svg className="phone-mock" viewBox="0 0 300 380" role="img" aria-label="Illustration of an Android app">
      {/* burst accents */}
      <g stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round">
        <path d="M32 60 l10 14 16-6-8 16 12 12-18 1-6 17-8-16-18 2 12-13-8-16 16 5z" fill="var(--pop)" />
      </g>
      <circle cx="262" cy="300" r="12" fill="var(--pop-2)" stroke="var(--ink)" strokeWidth="3" />
      <path d="M258 40 l4 12 12 2-9 8 3 12-10-7-10 7 3-12-9-8 12-2z" fill="var(--pop-3)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />

      {/* phone body */}
      <g transform="rotate(-4 150 200)">
        <rect x="70" y="30" width="160" height="320" rx="28" fill="var(--panel)" stroke="var(--ink)" strokeWidth="5" />
        {/* notch */}
        <rect x="128" y="42" width="44" height="10" rx="5" fill="var(--ink)" />
        {/* app bar */}
        <rect x="82" y="62" width="136" height="42" rx="10" fill="var(--pop)" stroke="var(--ink)" strokeWidth="3" />
        <circle cx="102" cy="83" r="9" fill="var(--on-pop)" />
        <rect x="120" y="78" width="72" height="10" rx="5" fill="var(--on-pop)" />
        {/* list rows */}
        <g>
          <rect x="82" y="118" width="136" height="40" rx="10" fill="var(--panel-2)" stroke="var(--ink)" strokeWidth="3" />
          <circle cx="102" cy="138" r="10" fill="var(--pop-3)" stroke="var(--ink)" strokeWidth="2" />
          <rect x="120" y="129" width="86" height="7" rx="3.5" fill="var(--ink-soft)" />
          <rect x="120" y="142" width="56" height="6" rx="3" fill="var(--muted)" />

          <rect x="82" y="168" width="136" height="40" rx="10" fill="var(--panel-2)" stroke="var(--ink)" strokeWidth="3" />
          <circle cx="102" cy="188" r="10" fill="var(--pop-4)" stroke="var(--ink)" strokeWidth="2" />
          <rect x="120" y="179" width="86" height="7" rx="3.5" fill="var(--ink-soft)" />
          <rect x="120" y="192" width="56" height="6" rx="3" fill="var(--muted)" />

          <rect x="82" y="218" width="136" height="40" rx="10" fill="var(--panel-2)" stroke="var(--ink)" strokeWidth="3" />
          <circle cx="102" cy="238" r="10" fill="var(--pop-2)" stroke="var(--ink)" strokeWidth="2" />
          <rect x="120" y="229" width="86" height="7" rx="3.5" fill="var(--ink-soft)" />
          <rect x="120" y="242" width="56" height="6" rx="3" fill="var(--muted)" />
        </g>
        {/* FAB */}
        <circle cx="196" cy="312" r="20" fill="var(--pop)" stroke="var(--ink)" strokeWidth="3" />
        <path d="M196 303 v18 M187 312 h18" stroke="var(--on-pop)" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Before/after bar comparison for the 44% APK reduction.
// Form = magnitude comparison; "after" carries the accent, "before" stays neutral.
export function ApkChart() {
  const max = 79.1;
  const before = 79.1;
  const after = 44;
  const plotH = 150;
  const baseY = 190;
  const beforeH = (before / max) * plotH;
  const afterH = (after / max) * plotH;

  return (
    <svg className="apk-chart" viewBox="0 0 320 240" role="img"
      aria-label="APK size reduced from 79.1 megabytes to 44 megabytes, a 44 percent drop">
      {/* baseline */}
      <line x1="30" y1={baseY} x2="290" y2={baseY} stroke="var(--ink)" strokeWidth="3" />

      {/* before bar (neutral) */}
      <rect x="70" y={baseY - beforeH} width="70" height={beforeH} rx="6"
        fill="var(--muted)" stroke="var(--ink)" strokeWidth="3" />
      <text x="105" y={baseY - beforeH - 12} textAnchor="middle" className="chart-value">79.1MB</text>
      <text x="105" y={baseY + 22} textAnchor="middle" className="chart-label">BEFORE</text>

      {/* after bar (accent) */}
      <rect x="180" y={baseY - afterH} width="70" height={afterH} rx="6"
        fill="var(--pop-4)" stroke="var(--ink)" strokeWidth="3" />
      <text x="215" y={baseY - afterH - 12} textAnchor="middle" className="chart-value">44MB</text>
      <text x="215" y={baseY + 22} textAnchor="middle" className="chart-label">AFTER</text>

      {/* -44% burst */}
      <g transform="translate(248 44)">
        <path d="M0 -22 l6 12 13-4-5 13 12 8-14 2-1 14-9-10-13 6 5-14-11-7 13-5z"
          fill="var(--pop-2)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
        <text x="0" y="4" textAnchor="middle" className="chart-burst">-44%</text>
      </g>
    </svg>
  );
}
