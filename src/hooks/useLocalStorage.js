import { useState } from 'react';

/**
 * Helper function to check if window.localStorage is available and writable.
 * Handles edge cases like private browsing modes or restricted cookie permissions.
 *
 * @returns {boolean} True if localStorage is accessible, otherwise false.
 */
function isLocalStorageAvailable() {
  try {
    const testKey = '__crm_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Custom hook to manage state persisted in window.localStorage.
 * Replicates the standard useState API, checking storage on load and writing updates instantly.
 *
 * @template T
 * @param {string} key - The localStorage storage key string.
 * @param {T | (() => T)} initialValue - The fallback value or functional initializer if no value exists in storage.
 * @returns {[T, (value: T | ((val: T) => T)) => void]} A stateful value and a function to update it.
 */
export function useLocalStorage(key, initialValue) {
  // Flag indicating if localStorage is available for reading and writing
  const storageAvailable = typeof window !== 'undefined' && isLocalStorageAvailable();

  // Read value from localStorage, parsing JSON, or falling back to initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (storageAvailable) {
        const item = window.localStorage.getItem(key);
        // If the key exists in storage, parse and return it; otherwise evaluate the initial value fallback
        if (item !== null) {
          return JSON.parse(item);
        }
      }
    } catch (error) {
      // Gracefully handle JSON parse exceptions or access blocks, log warning, and fall back
      console.warn(`Error reading localStorage key "${key}":`, error);
    }

    // Evaluate initial value if passed as a state initializer callback function
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  /**
   * Set value updates state in memory and localStorage simultaneously.
   * Accepts values or state mutation callbacks.
   *
   * @param {T | ((val: T) => T)} value - The new value or custom callback function.
   */
  const setValue = (value) => {
    try {
      // Allow value to be a function so we support the standard functional state updates
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Update state immediately to trigger re-renders
      setStoredValue(valueToStore);

      // Write to localStorage immediately
      if (storageAvailable) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Handle quota exceeded warnings or write blocks gracefully
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
export default useLocalStorage;
