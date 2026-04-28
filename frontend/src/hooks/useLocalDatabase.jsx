import { useState, useEffect } from 'react';

/**
 * useLocalDatabase
 * A robust wrapper around localStorage that auto-syncs React state.
 *
 * @param {string} key - The unique database key for localStorage.
 * @param {any} initialData - The baseline mock data to use if no local database exists yet.
 */
export function useLocalDatabase(key, initialData) {
  // 1. Initialize logic: read from local storage or fallback to initial data
  const [data, setData] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialData;
    } catch (error) {
      console.warn(`[LocalDB] Failed to read key "${key}"`, error);
      return initialData;
    }
  });

  // 2. Sync logic: save to local storage whenever state changes
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      const stringifiedData = JSON.stringify(data);
      if (item !== stringifiedData) {
        window.localStorage.setItem(key, stringifiedData);
      }
    } catch (error) {
      console.warn(`[LocalDB] Failed to save key "${key}"`, error);
    }
  }, [key, data]);

  // Handle cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        setData(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [data, setData];
}
