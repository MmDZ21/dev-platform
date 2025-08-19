'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';

export function ThemeSwitcher() {
  const { currentTheme, setCurrentTheme, availableThemes } = useTheme();

  return (
    <div className="flex items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <label htmlFor="theme-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Theme:
      </label>
      <select
        id="theme-select"
        value={currentTheme}
        onChange={(e) => setCurrentTheme(e.target.value as any)}
        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      >
        {availableThemes.map((theme) => (
          <option key={theme} value={theme}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
