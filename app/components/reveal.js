'use client';

import { useEffect, useRef, useState } from 'react';

// Apple-style scroll reveal: fades + slides children in as they enter the viewport.
//
// One observer for the whole page, not one per element. IntersectionObserver is built to watch many
// targets, and the projects page has ~25 <Reveal>s — that was 25 observers, each with its own
// callback and bookkeeping, doing what one does.
const callbacks = new WeakMap();
let observer;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        // a reveal happens once; stop watching immediately so the callback can't fire twice
        observer.unobserve(entry.target);
        callbacks.delete(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );
  return observer;
}

export default function Reveal({ children, as: Tag = 'div', className = '', delay = 0, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const io = getObserver();
    callbacks.set(node, () => setShown(true));
    io.observe(node);

    return () => {
      io.unobserve(node);
      callbacks.delete(node);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
