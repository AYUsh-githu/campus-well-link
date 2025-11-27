import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (x: number, y: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = (x: number, y: number) => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Create fade overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9998';
    overlay.style.backgroundColor = newTheme === 'dark' ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s ease-in-out';
    
    document.body.appendChild(overlay);
    
    // Fade in
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });
    
    // Change theme midway through fade
    setTimeout(() => {
      setTheme(newTheme);
    }, 200);
    
    // Fade out and clean up
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
      }, 400);
    }, 200);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};