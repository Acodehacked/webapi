import React from 'react';

export default function CountryCard({ country, isFavorite, onToggleFavorite, onSelect }) {
  const id       = country.codes?.alpha_3;
  const name     = country.names?.common;
  const flagUrl  = country.flag?.url_png;
  const flagAlt  = country.flag?.description || `Flag of ${name}`;
  const capital  = country.capitals?.[0]?.name;
  const region   = country.region;
  const pop      = country.population;

  return (
    <article className="country-card" onClick={() => onSelect(country)}>
      <div className="card-flag">
        <img src={flagUrl} alt={flagAlt} loading="lazy" />
      </div>
      <div className="card-body">
        <div className="card-header">
          <h3 className="country-name">{name}</h3>
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={e => { e.stopPropagation(); onToggleFavorite(country); }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="card-info">
          <p><span>Capital:</span> {capital ?? 'N/A'}</p>
          <p><span>Region:</span> {region ?? 'N/A'}</p>
          <p><span>Population:</span> {pop?.toLocaleString() ?? 'N/A'}</p>
        </div>
      </div>
    </article>
  );
}
