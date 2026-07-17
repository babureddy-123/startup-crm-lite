import React from 'react';
// Import required Sun and Moon symbols from Lucide React
import { Sun, Moon } from 'lucide-react';
// Import the custom hook to fetch and update theme state
import { useTheme } from '../../context/ThemeContext';

/**
 * DarkModeToggle renders a responsive, animated slider button.
 * Uses transition animations to slide the active icon and displays
 * the active mode label ("Light", "Dark", or "System").
 * Uses dynamic variables/theme tokens (`border-border-subtle`, `bg-bg-base`, etc.) for themes.
 *
 * @returns {React.JSX.Element} Rendered Dark Mode Toggle Switch.
 */
export default function DarkModeToggle() {
  // Extract theme states and toggle handles from the custom useTheme context hook
  const { isDarkMode, toggleTheme, themeMode } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      // Replaced hardcoded gray/slate colors with theme tokens
      className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-border-subtle bg-bg-base hover:bg-bg-base/80 transition-all duration-200 focus:outline-none cursor-pointer select-none group"
      title="Switch Theme"
      aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Visual slider track wrapper */}
      <div className="relative w-9 h-5 bg-border-subtle/50 rounded-full transition-colors duration-200">
        {/* Animated slider thumb holding active icon indicator */}
        <div 
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-surface-card shadow flex items-center justify-center transition-transform duration-200 ease-in-out ${
            isDarkMode ? 'translate-x-4' : 'translate-x-0'
          }`}
        >
          {isDarkMode ? (
            <Moon className="w-2.5 h-2.5 text-primary group-hover:scale-110 transition-transform" />
          ) : (
            <Sun className="w-2.5 h-2.5 text-amber-500 group-hover:scale-110 transition-transform" />
          )}
        </div>
      </div>
      
      {/* Current mode text indicator (Light, Dark, or System) */}
      <span className="text-xs font-semibold text-txt-sub font-sans tracking-wide capitalize">
        {themeMode === 'system' ? 'system' : isDarkMode ? 'dark' : 'light'}
      </span>
    </button>
  );
}
