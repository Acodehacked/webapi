import React from 'react';

const REGIONS = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

export default function Header({
  search, onSearch,
  region, onRegion,
  theme, onThemeToggle,
  favCount, onFavToggle, showFav,
  onDetectRegion, detectedRegion,
}) {
  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-logo">🌍</span>
        <h1>World Explorer</h1>
      </div>

      <div className="header-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search countries, capitals..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            aria-label="Search countries"
          />
          {search && (
            <button className="clear-btn" onClick={() => onSearch('')} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <select
          className="region-select"
          value={region}
          onChange={e => onRegion(e.target.value)}
          aria-label="Filter by region"
        >
          {REGIONS.map(r => (
            <option key={r} value={r}>{r === 'All' ? 'All Regions' : r}</option>
          ))}
        </select>

        <button
          className={`fav-btn ${showFav ? 'active' : ''}`}
          onClick={onFavToggle}
          title={showFav ? 'Show all countries' : 'Show favorites'}
        >
          {showFav ? '🌐 All Countries' : `❤️ Favorites (${favCount})`}
        </button>

        <button
          className="detect-btn"
          onClick={onDetectRegion}
          title="Detect my region"
        >
          📍 {detectedRegion ? detectedRegion : 'My Region'}
        </button>

        <button
          className="theme-btn"
          onClick={onThemeToggle}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
