import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  {
    id: 'ocean-dark',
    name: 'Ocean Dark',
    description: 'Deep sapphire & midnight blue',
    preview: 'linear-gradient(135deg, #060d1f 50%, #3b82f6 100%)',
    dot: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    dark: true,
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Pure black with violet accents',
    preview: 'linear-gradient(135deg, #111111 50%, #7c3aed 100%)',
    dot: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    dark: true,
  },
  {
    id: 'pearl',
    name: 'Pearl Light',
    description: 'Clean white with navy sidebar',
    preview: 'linear-gradient(135deg, #f1f5f9 50%, #2563eb 100%)',
    dot: 'linear-gradient(135deg, #2563eb, #10b981)',
    dark: false,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Dark teal with emerald glow',
    preview: 'linear-gradient(135deg, #060e1f 50%, #10b981 100%)',
    dot: 'linear-gradient(135deg, #06b6d4, #10b981)',
    dark: true,
  },
];

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('erp-theme') || 'ocean-dark';
  });

  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('erp-theme', themeId);
  }, [themeId]);

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, currentTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
