import React, { useEffect } from 'react';

export default function CountryDetail({ country, isFavorite, onToggleFavorite, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!country) return null;

  const { name, flags, capital, region, subregion, population, area, languages, currencies, borders, timezones } = country;

  const languageList = languages ? Object.values(languages).join(', ') : 'N/A';
  const currencyList = currencies
    ? Object.values(currencies).map(c => `${c.name}${c.symbol ? ` (${c.symbol})` : ''}`).join(', ')
    : 'N/A';

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="detail-header">
          <img src={flags?.svg || flags?.png} alt={flags?.alt || `Flag of ${name.common}`} className="detail-flag" />
          <div className="detail-title">
            <h2>{name.common}</h2>
            <p className="official-name">{name.official}</p>
            <button
              className={`favorite-btn large ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(country)}
            >
              {isFavorite ? '❤️ Saved to Favorites' : '🤍 Add to Favorites'}
            </button>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-section">
            <h4>Geography</h4>
            <p><span>Capital:</span> {capital?.[0] ?? 'N/A'}</p>
            <p><span>Region:</span> {region}</p>
            <p><span>Subregion:</span> {subregion ?? 'N/A'}</p>
            <p><span>Area:</span> {area ? `${area.toLocaleString()} km²` : 'N/A'}</p>
          </div>
          <div className="detail-section">
            <h4>People & Economy</h4>
            <p><span>Population:</span> {population?.toLocaleString() ?? 'N/A'}</p>
            <p><span>Languages:</span> {languageList}</p>
            <p><span>Currencies:</span> {currencyList}</p>
            <p><span>Timezones:</span> {timezones?.slice(0, 3).join(', ') ?? 'N/A'}{timezones?.length > 3 ? ` +${timezones.length - 3} more` : ''}</p>
          </div>
        </div>

        {borders?.length > 0 && (
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
