import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ipl-theme';

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY) || 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  return { theme, setTheme, toggleTheme };
}
