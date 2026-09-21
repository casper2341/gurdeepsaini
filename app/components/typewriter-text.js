'use client';

import { useEffect, useState } from 'react';
import { typewriterPhrases as PHRASES } from '@/data/profile';

// The home page's <h1>. Three things about it are deliberate:
//
// 1. `displayText` starts at the FIRST PHRASE, not ''. This heading is the h1 of the site's most
//    important page, and starting empty meant the prerendered HTML shipped `<h1></h1>` — nothing
//    for a crawler that doesn't run JS, and nothing for the ~1s before hydration.
// 2. The accessible name is a fixed aria-label and the animated span is aria-hidden. It used to
//    carry aria-live="polite" over text that changes every 45–75ms, which queued an announcement
//    per keystroke and left the main heading with no stable name. aria-label rather than a
//    visually-hidden twin, so the phrase appears in the markup once rather than twice.
// 3. The animation is JS, so the CSS prefers-reduced-motion block can't reach it — the effect has
//    to opt out itself, which leaves the first phrase on screen as a static headline.
export default function TypewriterText() {
  const [displayText, setDisplayText] = useState(PHRASES[0]);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const currentPhrase = PHRASES[phraseIndex];
    let timeout;

    if (!isDeleting && displayText === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayText === '') {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
      }, 450);
    } else {
      const speed = isDeleting ? 45 : 75;
      timeout = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? currentPhrase.slice(0, prev.length - 1)
            : currentPhrase.slice(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <h1 className="typewriter-headline" aria-label={PHRASES[0]}>
      <span className="typewriter-text" aria-hidden="true">
        {displayText}
      </span>
      <span className="typewriter-cursor" aria-hidden="true" />
    </h1>
  );
}
