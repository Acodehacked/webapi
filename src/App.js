import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import CountryCard from './components/CountryCard';
import CountryDetail from './components/CountryDetail';
import { useLocalStorage } from './hooks/useLocalStorage';

const API_BASE = '/countries/v5';

export default function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [favorites, setFavorites] = useLocalStorage('wex-favorites', []);
  const [searchHistory, setSearchHistory] = useLocalStorage('wex-search-history', []);

  // Restore last search from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('wex-session-search');
    if (saved) setSearchInput(saved);
  }, []);

  useEffect(() => {
    sessionStorage.setItem('wex-session-search', searchInput);
  }, [searchInput]);

  // Debounced search fetch
  useEffect(() => {
    const q = searchInput.trim();
    if (!q) { setResults([]); setLoading(false); setError(null); return; }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);

      fetch(`${API_BASE}?q=${encodeURIComponent(q)}&limit=50`, { signal: controller.signal })
        .then(res => res.json())
        .then(json => {
          if (!json.success) throw new Error(json.errors?.[0]?.message || 'API error');
          setResults(json.data ?? []);
          setLoading(false);
          if (q.length > 2) {
            setSearchHistory(prev => [q, ...prev.filter(s => s !== q)].slice(0, 6));
          }
        })
        .catch(err => {
          if (err.name !== 'AbortError') { setError(err.message); setLoading(false); }
        });
    }, 400);

    return () => { clearTimeout(timer); controller.abort(); };
  }, [searchInput, setSearchHistory]);

  const toggleFavorite = useCallback((country) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.cca3 === country.cca3);
      return exists ? prev.filter(f => f.cca3 !== country.cca3) : [...prev, country];
    });
  }, [setFavorites]);

  const isFav = useCallback((cca3) => favorites.some(f => f.cca3 === cca3), [favorites]);

  const isSearching = searchInput.trim().length > 0;

  return (
    <div className="app">
      <div className="hero">
        <h1 className="hero-title">World Explorer</h1>
        <p className="hero-sub">Search any country, capital, or region</p>
        <p>Uses api - https://api.restcountries.com/v5/contries</p>
        <div className="search-wrap mt-2">
          <input
            className="search-input"
            type="text"
            placeholder="e.g. India, Paris, Europe…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            autoFocus
          />
          {searchInput && (
            <button className="search-clear" onClick={() => setSearchInput('')}>✕</button>
          )}
        </div>

        {/* Recent search chips */}
        {!isSearching && searchHistory.length > 0 && (
          <div className="history-row">
            {searchHistory.map(s => (
              <button key={s} className="history-chip" onClick={() => setSearchInput(s)}>{s}</button>
            ))}
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

        {error && <p className="error-msg">⚠️ {error}</p>}

        {!loading && isSearching && !error && results.length === 0 && (
          <p className="no-results">No countries found for "<em>{searchInput.trim()}</em>"</p>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="results-count">{results.length} result{results.length !== 1 ? 's' : ''}</p>
            <div className="countries-grid">
              {results.map(country => (
                <CountryCard
                  key={country.cca3}
                  country={country}
                  isFavorite={isFav(country.cca3)}
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
          isFavorite={isFav(selectedCountry.cca3)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
