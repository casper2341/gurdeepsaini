'use client';

import { useEffect, useRef, useState } from 'react';
import { MoonIcon, SoundOffIcon, SoundOnIcon, SunIcon } from '@/components/icons';

// Interactive bits of the comic chrome shared by the portfolio and travel shells.

// ---------------------------------------------------------------------------
// Click-sound preference
//
// ClickSound and SoundToggle share this module, so module scope is the shared state — no context
// needed for two components that always mount together. Resolved lazily because it reads
// localStorage and matchMedia, neither of which exists during the server render.
//
// Default ON, because the click is the first thing most visitors notice — except under
// prefers-reduced-motion, where a request for less sensory feedback covers a buzz and a click as
// much as it covers an animation.
let soundOn = null;

function isSoundOn() {
  if (soundOn !== null) return soundOn;
  let saved = null;
  try {
    saved = window.localStorage.getItem('sound'); // 'on' | 'off' | null
  } catch {
    // private mode: fall through to the reduced-motion default
  }
  soundOn = saved ? saved === 'on' : !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return soundOn;
}

function setSoundOn(next) {
  soundOn = next;
  try {
    window.localStorage.setItem('sound', next ? 'on' : 'off');
  } catch {
    // not remembered across page views, but honoured for this one
  }
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  // The body class is the source of truth, not `isDark` — two toggles mounted at once (header and
  // a drawer, say) would otherwise each flip their own copy and drift apart.
  const toggleTheme = () => {
    const next = !document.body.classList.contains('dark-theme');
    document.body.classList.toggle('dark-theme', next);
    try {
      window.localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // Safari in private mode throws on setItem; the class is already applied, so the theme still
      // works for this page view and simply isn't remembered.
    }
    setIsDark(next);
  };

  // The inline script in app/layout.js has already applied the saved theme; sync the icon to it.
  useEffect(() => {
    setIsDark(document.body.classList.contains('dark-theme'));
  }, []);

  return (
    <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export function ClickSound() {
  const audioContextRef = useRef(null);

  useEffect(() => {
    // Synthesized mechanical keyboard press: a sharp filtered-noise "click" (the
    // switch snapping) layered over a short low "thock" (the keycap bottoming out).
    const playInteraction = () => {
      if (navigator.vibrate) {
        navigator.vibrate(8);
      }

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      // --- the click: a tiny decaying burst of band-passed white noise ---
      const noiseDur = 0.028;
      const frames = Math.max(1, Math.ceil(ctx.sampleRate * noiseDur));
      const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frames; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 2700;
      bandpass.Q.value = 0.8;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.55, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDur);
      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + noiseDur);

      // --- the thock: short low body that bottoms out fast ---
      const thock = ctx.createOscillator();
      thock.type = 'triangle';
      thock.frequency.setValueAtTime(190, now);
      thock.frequency.exponentialRampToValueAtTime(90, now + 0.05);
      const thockGain = ctx.createGain();
      thockGain.gain.setValueAtTime(0.0001, now);
      thockGain.gain.linearRampToValueAtTime(0.26, now + 0.004);
      thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      thock.connect(thockGain);
      thockGain.connect(ctx.destination);
      thock.start(now);
      thock.stop(now + 0.07);
    };

    const handleClick = (event) => {
      // checked per click, so the toggle takes effect immediately rather than on the next mount
      if (!isSoundOn()) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('.button, button, .nav-link, .icon-button')) {
        playInteraction();
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      // an AudioContext is a real resource with an explicit release, and browsers cap how many can
      // exist at once; it was previously held for the life of the page and never closed
      audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, []);

  return null;
}

export function SoundToggle() {
  // Starts on to match the common case; the effect corrects it after mount, exactly as ThemeToggle
  // does for the theme. Nothing paints differently before then except this one icon.
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(isSoundOn());
  }, []);

  const toggle = () => {
    const next = !isSoundOn();
    setSoundOn(next);
    setOn(next);
  };

  return (
    <button
      className="icon-button"
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn click sound off' : 'Turn click sound on'}
    >
      {on ? <SoundOnIcon /> : <SoundOffIcon />}
    </button>
  );
}
