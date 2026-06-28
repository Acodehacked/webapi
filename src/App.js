import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import CountryCard from './components/CountryCard';
import CountryDetail from './components/CountryDetail';
import { useLocalStorage } from './hooks/useLocalStorage';

const API_KEY  = 'rc_live_473794fd12414cdfa51391fa7bd49d27';
const API_BASE = 'https://api.restcountries.com/countries/v5';

const LIMIT_OPTIONS = [5, 10, 25, 50];

export default function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  // ── Preferences saved in localStorage ──────────────────────────────────
  const [theme, setTheme] = useLocalStorage('wex-pref-theme', 'light');
  const [limit, setLimit] = useLocalStorage('wex-pref-limit', 10);
  // ────────────────────────────────────────────────────────────────────────

  const [favorites, setFavorites] = useLocalStorage('wex-favorites', []);
  const [searchHistory, setSearchHistory] = useLocalStorage('wex-search-history', []);

  const controllerRef = useRef(null);

  // Apply theme to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Restore last session search
  useEffect(() => {
    const saved = sessionStorage.getItem('wex-session-search');
    if (saved) setSearchInput(saved);
  }, []);

  const handleSearch = useCallback(() => {
    const q = searchInput.trim();
    if (!q) return;

    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setResults([]);
    sessionStorage.setItem('wex-session-search', q);

    fetch(`${API_BASE}?q=${encodeURIComponent(q)}&limit=${limit}`, {
      signal: controllerRef.current.signal,
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    })
      .then(res => res.json())
      .then(json => {
        const objects = json?.data?.objects;
        if (!Array.isArray(objects)) throw new Error(json?.errors?.[0]?.message || 'Unexpected response from API');
        setResults(objects);
        setLoading(false);
        if (q.length > 2) {
          setSearchHistory(prev => [q, ...prev.filter(s => s !== q)].slice(0, 6));
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });
  }, [searchInput, limit, setSearchHistory]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') handleSearch();
  }, [handleSearch]);

  const handleClear = useCallback(() => {
    if (controllerRef.current) controllerRef.current.abort();
    setSearchInput('');
    setResults([]);
    setError(null);
    setLoading(false);
    sessionStorage.removeItem('wex-session-search');
  }, []);

  const getId = (country) => country?.codes?.alpha_3;

  const toggleFavorite = useCallback((country) => {
    const id = getId(country);
    setFavorites(prev => {
      const exists = prev.some(f => getId(f) === id);
      return exists ? prev.filter(f => getId(f) !== id) : [...prev, country];
    });
  }, [setFavorites]);

  const isFav = useCallback((id) => favorites.some(f => getId(f) === id), [favorites]);

  const isSearching = searchInput.trim().length > 0;

  return (
    <div className="app">
      <div className="hero">
        <h1 className="hero-title">World Explorer</h1>
        <p>Uses Api https://api.restcountries.com/countries/v5</p>
        <p className="hero-sub">Search any country, capital, or region</p>

        <div className="search-wrap mt-2">
          <input
            className="search-input"
            type="text"
            placeholder="e.g. India, Paris, Europe…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          {searchInput && (
            <button className="search-clear" onClick={handleClear} title="Clear">✕</button>
          )}
        </div>

        <button
          className="search-btn"
          onClick={handleSearch}
          disabled={!isSearching || loading}
        >
          {loading ? 'Searching…' : 'Search'}
        </button>

        {/* ── Preferences (saved to localStorage) ── */}
        <div className="prefs">
          <div className="pref-group">
            <label className="pref-label">Results limit</label>
            <div className="pref-options">
              {LIMIT_OPTIONS.map(n => (
                <button
                  key={n}
                  className={`pref-chip ${limit === n ? 'active' : ''}`}
                  onClick={() => setLimit(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="pref-group">
            <label className="pref-label">Theme</label>
            <div className="pref-options">
              <button
                className={`pref-chip ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                ☀️ Light
              </button>
              <button
                className={`pref-chip ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </div>

        {!isSearching && searchHistory.length > 0 && (
          <div className="history-row">
            {searchHistory.map(s => (
              <button key={s} className="history-chip" onClick={() => setSearchInput(s)}>
                {s}
              </button>
            ))}
            <button className="history-clear" onClick={() => setSearchHistory([])}>Clear</button>
          </div>
        )}
      </div>

      <main className="main">
        {loading && (
          <div className="loading">
            <div className="spinner" />
            <p>Searching…</p>
          </div>
        )}

        {!loading && error && <p className="error-msg">⚠️ {error}</p>}

        {!loading && !error && isSearching && results.length === 0 && (
          <p className="no-results">No countries found for "<em>{searchInput.trim()}</em>"</p>
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <p className="results-count">
              {results.length} result{results.length !== 1 ? 's' : ''}
              <span className="results-meta"> · limit {limit}</span>
            </p>
            <div className="countries-grid">
              {results.map(country => (
                <CountryCard
                  key={country.codes?.alpha_3}
                  country={country}
                  isFavorite={isFav(country.codes?.alpha_3)}
                  onToggleFavorite={toggleFavorite}
                  onSelect={setSelectedCountry}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {selectedCountry && (
        <CountryDetail
          country={selectedCountry}
          isFavorite={isFav(selectedCountry.codes?.alpha_3)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
