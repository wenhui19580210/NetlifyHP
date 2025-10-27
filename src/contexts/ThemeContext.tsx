import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  mainColor: string;
  subColor: string;
  setColors: (main: string, sub: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'tokatsu-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mainColor, setMainColor] = useState<string>('#f59e0b');
  const [subColor, setSubColor] = useState<string>('#0ea5e9');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { main, sub } = JSON.parse(saved);
        if (main) setMainColor(main);
        if (sub) setSubColor(sub);
      } catch (e) {
        console.error('テーマの読み込みに失敗しました', e);
      }
    }
  }, []);

  const setColors = (main: string, sub: string) => {
    setMainColor(main);
    setSubColor(sub);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ main, sub }));
  };

  useEffect(() => {
    // CSS変数を設定
    const root = document.documentElement;
    root.style.setProperty('--color-primary', mainColor);
    root.style.setProperty('--color-primary-dark', adjustColor(mainColor, -20));
    root.style.setProperty('--color-primary-light', adjustColor(mainColor, 40));
    root.style.setProperty('--color-sub', subColor);
  }, [mainColor, subColor]);

  return (
    <ThemeContext.Provider value={{ mainColor, subColor, setColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// 色の明度を調整
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}
