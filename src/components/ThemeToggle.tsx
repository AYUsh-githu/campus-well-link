import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    toggleTheme(x, y);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="fixed top-4 right-4 z-50 glass-card hover:scale-110 transition-all duration-300"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 transition-transform duration-300 rotate-0 hover:rotate-12" />
      ) : (
        <Sun className="h-5 w-5 transition-transform duration-300 rotate-0 hover:rotate-12" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};