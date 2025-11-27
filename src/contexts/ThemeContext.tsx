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
    
    // Create radial expansion overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9998';
    overlay.style.overflow = 'hidden';
    
    const circle = document.createElement('div');
    circle.style.position = 'absolute';
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.width = '0';
    circle.style.height = '0';
    circle.style.borderRadius = '50%';
    circle.style.transform = 'translate(-50%, -50%)';
    circle.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    circle.style.backgroundColor = newTheme === 'dark' ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)';
    
    overlay.appendChild(circle);
    document.body.appendChild(overlay);
    
    // Calculate the distance needed to cover entire screen from click point
    const maxDistance = Math.sqrt(
      Math.pow(Math.max(x, window.innerWidth - x), 2) + 
      Math.pow(Math.max(y, window.innerHeight - y), 2)
    ) * 2.5;
    
    // Trigger animation
    requestAnimationFrame(() => {
      circle.style.width = `${maxDistance}px`;
      circle.style.height = `${maxDistance}px`;
    });
    
    // Change theme midway through animation
    setTimeout(() => {
      setTheme(newTheme);
    }, 400);
    
    // Clean up
    setTimeout(() => {
      overlay.remove();
    }, 800);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};