import Link from 'next/link';

// One city pin, shared by the world, India and state maps. The geometry is authored in screen
// pixels and CSS rescales it by --u / --k, which is what keeps a pin ~14px at every zoom level and
// on every screen. `label` differs per map: the world map names the country, a state map doesn't.
export default function MapPin({ place, x, y, label, meta }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Link
        href={`/${place.slug}`}
        className={`map-pin is-${place.status}`}
        aria-label={`${label}. ${meta}`}
        data-title={label}
        data-meta={meta}
      >
        <g className="map-pin-body">
          <circle className="map-pin-hit" r="14" />
          <circle className="map-pin-pulse" r="7" />
          <circle className="map-pin-shadow" cx="2" cy="2" r="7" />
          <circle className="map-pin-dot" r="7" />
        </g>
      </Link>
    </g>
  );
}
