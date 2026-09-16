'use client';

import { useEffect, useState } from 'react';
import SpotCard from './spot-card';

// Category chips + the spot sections they filter. The active chip is mirrored to
// ?c= so a filtered view is shareable. It's read from window.location after mount
// instead of useSearchParams(), which keeps the city page fully static: the server
// renders every section, and a shared ?c= link narrows it on hydration.
export default function SpotFilter({ groups }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('c');
    if (groups.some((group) => group.id === requested)) setActive(requested);
  }, [groups]);

  const choose = (id) => {
    setActive(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set('c', id);
    else url.searchParams.delete('c');
    window.history.replaceState(null, '', url);
  };

  const total = groups.reduce((sum, group) => sum + group.spots.length, 0);
  const visible = active ? groups.filter((group) => group.id === active) : groups;

  return (
    <>
      {groups.length > 1 && (
        <div className="spot-filter" role="toolbar" aria-label="Filter spots by category">
          <button type="button" className="chip filter-chip" aria-pressed={!active} onClick={() => choose(null)}>
            All <span className="filter-count">{total}</span>
          </button>
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              className="chip filter-chip"
              aria-pressed={active === group.id}
              onClick={() => choose(group.id)}
            >
              {group.label} <span className="filter-count">{group.spots.length}</span>
            </button>
          ))}
        </div>
      )}

      {visible.map((group) => (
        <section key={group.id} id={group.id} className="spot-section" aria-labelledby={`${group.id}-title`}>
          <h2 id={`${group.id}-title`} className="spot-section-title">
            {group.label} <span className="filter-count">{group.spots.length}</span>
          </h2>
          <div className="spot-grid">
            {group.spots.map((spot) => (
              <SpotCard key={`${spot.name}-${spot.area}`} spot={spot} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
