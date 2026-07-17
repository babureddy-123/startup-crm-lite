import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * @typedef {Object} SearchBarProps
 * @property {string} value - The active search query text passed from the parent state.
 * @property {function(string): void} onChange - Callback function dispatched (debounced by 300ms) with the updated search string.
 */

/**
 * SearchBar component renders a search input text field.
 * Uses dynamic variables/theme tokens (`bg-bg-base`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 *
 * @param {SearchBarProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered search input.
 */
export default function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, onChange, value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative w-full">
      {/* Magnifying Glass Search Icon */}
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-txt-sub">
        <Search className="h-4 w-4" />
      </span>

      {/* Input field */}
      <input
        type="text"
        placeholder="Search by name, company, or email..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        // Replaced hardcoded gray/white colors with theme tokens: bg-bg-base, border-border-subtle and text-txt-main
        className="w-full pl-9 pr-9 py-3 md:py-2 bg-bg-base border border-border-subtle rounded-lg text-sm placeholder-txt-sub focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-txt-main"
        aria-label="Search opportunities by name, company, or email"
      />

      {/* Clear Button */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 w-11 h-full flex items-center justify-center text-txt-sub hover:text-txt-main transition-colors cursor-pointer focus:outline-none"
          title="Clear search query"
          aria-label="Clear search input"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
