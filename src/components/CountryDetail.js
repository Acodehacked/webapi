import React, { useEffect } from 'react';

export default function CountryDetail({ country, isFavorite, onToggleFavorite, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!country) return null;

  const name       = country.names?.common;
  const official   = country.names?.official;
  const flagUrl    = country.flag?.url_svg || country.flag?.url_png;
  const flagAlt    = country.flag?.description || `Flag of ${name}`;
  const capital    = country.capitals?.[0]?.name;
  const region     = country.region;
  const subregion  = country.subregion;
  const population = country.population;
  const areaKm     = country.area?.kilometers;
  const languages  = country.languages?.map(l => l.name).join(', ') || 'N/A';
  const currencies = country.currencies?.map(c => `${c.name}${c.symbol ? ` (${c.symbol})` : ''}`).join(', ') || 'N/A';
  const borders    = country.borders ?? [];
  const timezones  = country.timezones ?? [];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="detail-header">
          <img src={flagUrl} alt={flagAlt} className="detail-flag" />
          <div className="detail-title">
            <h2>{name}</h2>
            <p className="official-name">{official}</p>
            <button
              className={`favorite-btn large ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(country)}
            >
              {isFavorite ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-section">
            <h4>Geography</h4>
            <p><span>Capital:</span> {capital ?? 'N/A'}</p>
            <p><span>Region:</span> {region ?? 'N/A'}</p>
            <p><span>Subregion:</span> {subregion ?? 'N/A'}</p>
            <p><span>Area:</span> {areaKm ? `${areaKm.toLocaleString()} km²` : 'N/A'}</p>
            <p><span>Landlocked:</span> {country.landlocked ? 'Yes' : 'No'}</p>
          </div>
          <div className="detail-section">
            <h4>People & Economy</h4>
            <p><span>Population:</span> {population?.toLocaleString() ?? 'N/A'}</p>
            <p><span>Languages:</span> {languages}</p>
            <p><span>Currencies:</span> {currencies}</p>
            <p><span>Timezones:</span> {timezones.slice(0, 3).join(', ')}{timezones.length > 3 ? ` +${timezones.length - 3} more` : ''}</p>
            <p><span>Driving side:</span> {country.cars?.driving_side ?? 'N/A'}</p>
          </div>
        </div>

        {borders.length > 0 && (
          <div className="border-countries">
            <h4>Border Countries</h4>
            <div className="border-tags">
              {borders.map(b => <span key={b} className="border-tag">{b}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
