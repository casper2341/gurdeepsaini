import { ExternalIcon } from '@/components/icons';

// One spot as a comic panel. `spot.mapHref` is resolved on the server (see mapsHref).
export default function SpotCard({ spot }) {
  return (
    <article className="comic-panel spot-card">
      <div className="spot-head">
        <h3>{spot.name}</h3>
        {spot.rating ? <Rating value={spot.rating} /> : null}
      </div>
      {spot.area ? <p className="spot-area">{spot.area}</p> : null}
      {spot.note ? <p className="spot-note">{spot.note}</p> : null}
      {spot.tags?.length ? (
        <div className="chip-row">
          {spot.tags.map((tag) => (
            <span key={tag} className="chip">{tag}</span>
          ))}
        </div>
      ) : null}
      <a className="project-cta spot-maps" href={spot.mapHref} target="_blank" rel="noreferrer">
        Open in Maps <ExternalIcon />
      </a>
    </article>
  );
}

function Rating({ value }) {
  return (
    <span className="spot-rating" role="img" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < value ? 'is-on' : ''} />
      ))}
    </span>
  );
}
