import { useState, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Stable reference — depends only on `key`, uses functional updater so it
  // never closes over stale state and never changes identity between renders.
  const setValue = useCallback((value) => {
    setStoredValue(prev => {
      const next = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch (err) {
        console.error('localStorage write failed:', err);
      }
      return next;
    });
  }, [key]);

  return [storedValue, setValue];
}
