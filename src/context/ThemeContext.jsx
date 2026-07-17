import React, { createContext, useContext, useEffect, useState } from 'react';
// Import the custom localStorage persistence hook
import { useLocalStorage } from '../hooks/useLocalStorage';

// Create the Context Object for theme management.
export const ThemeContext = createContext();

/**
 * ThemeProvider component manages the application's visual mode state.
 * Supports 'light', 'dark', and 'system' preferences.
 * Persists the choice in localStorage under 'startup-crm-theme-mode'.
 * Also maintains a legacy 'startup-crm-theme' boolean for backward compatibility.
 *
 * @param {Object} props - React props.
 * @param {React.ReactNode} props.children - Child elements to wrap.
 * @returns {React.JSX.Element} The context Provider layout.
 */
export function ThemeProvider({ children }) {
  // Main state: themeMode can be 'light' | 'dark' | 'system'. Defaults to 'system'
  const [themeMode, setThemeMode] = useLocalStorage('startup-crm-theme-mode', 'system');
  
  // Computed dark mode boolean state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply visual theme to the document HTML root based on active selection
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    /**
     * Re-calculates and applies dark mode class dynamically.
     */
    const updateTheme = () => {
      let computedDark = false;
      if (themeMode === 'system') {
        computedDark = mediaQuery.matches;
      } else {
        computedDark = themeMode === 'dark';
      }

      setIsDarkMode(computedDark);
      
      // Update legacy key for backward compatibility & page-load blocking script
      localStorage.setItem('startup-crm-theme', String(computedDark));

      if (computedDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    // Initial check
    updateTheme();

    // Listener handler for system settings changes
    const handleSystemChange = () => {
      if (themeMode === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, [themeMode]);

  /**
   * Toggles the theme state between light and dark selection.
   */
  const toggleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'dark') {
        return 'light';
      } else {
        return 'dark';
      }
    });
  };

  // Compatibility string ('light' | 'dark')
  const theme = isDarkMode ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, themeMode, setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to consume the ThemeContext.
 *
 * @returns {Object} Theme context state values and handlers.
 * @throws {Error} Throws descriptive error if used outside ThemeProvider.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be called within an active ThemeProvider boundary.');
  }
  return context;
}
