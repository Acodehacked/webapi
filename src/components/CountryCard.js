import React from 'react';

export default function CountryCard({ country, isFavorite, onToggleFavorite, onSelect }) {
  const { name, flags, capital, region, population, cca3 } = country;

  return (
    <article className="country-card" onClick={() => onSelect(country)}>
      <div className="card-flag">
        <img
          src={flags.png}
          alt={flags.alt || `Flag of ${name.common}`}
          loading="lazy"
        />
      </div>
      <div className="card-body">
        <div className="card-header">
          <h3 className="country-name">{name.common}</h3>
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={e => { e.stopPropagation(); onToggleFavorite(country); }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? `Remove ${name.common} from favorites` : `Add ${name.common} to favorites`}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="card-info">
          <p><span>Capital:</span> {capital?.[0] ?? 'N/A'}</p>
          <p><span>Region:</span> {region}</p>
          <p><span>Population:</span> {population.toLocaleString()}</p>
        </div>
      </div>
    </article>
  );
}
