'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeName = 'dark' | 'light';

interface ThemeContextType {
  currentTheme: ThemeName;
  setCurrentTheme: (theme: ThemeName) => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentThemeState] = useState<ThemeName>('dark');

  useEffect(() => {
    // Initialize theme on mount
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      setCurrentThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme class without overriding other classes
    const themeClassDark = 'theme-dark';
    const themeClassLight = 'theme-light';

    document.body.classList.remove(themeClassDark, themeClassLight);
    document.body.classList.add(currentTheme === 'dark' ? themeClassDark : themeClassLight);
  }, [currentTheme]);

  const handleThemeChange = (themeName: ThemeName) => {
    setCurrentThemeState(themeName);
    localStorage.setItem('theme', themeName);
  };

  const value: ThemeContextType = {
    currentTheme,
    setCurrentTheme: handleThemeChange,
    availableThemes: ['dark', 'light'],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
