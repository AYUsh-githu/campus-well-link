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
    
    // Check if View Transitions API is supported
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        setTheme(newTheme);
      });
    } else {
      // Fallback: create manual ripple effect
      const ripple = document.createElement('div');
      ripple.style.position = 'fixed';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '9999';
      ripple.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      ripple.style.backgroundColor = newTheme === 'dark' ? '#1a1a1a' : '#ffffff';
      
      document.body.appendChild(ripple);
      
      // Trigger animation
      requestAnimationFrame(() => {
        const maxDimension = Math.max(window.innerWidth, window.innerHeight) * 2.5;
        ripple.style.width = `${maxDimension}px`;
        ripple.style.height = `${maxDimension}px`;
        
        setTimeout(() => {
          setTheme(newTheme);
          setTimeout(() => {
            ripple.remove();
          }, 100);
        }, 300);
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};