import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { applyTheme, currentTheme } from '../../lib/theme.js';

export function ThemeToggle({ className = '' }) {
  const [isDark, setIsDark] = useState(currentTheme() === 'dark');
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      className={className ? `theme-toggle ${className}` : 'theme-toggle'}
      type="button"
      onClick={() => {
        const next = !isDark;
        setIsDark(next);
        applyTheme(next ? 'dark' : 'light');
      }}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
    >
      <Icon size={19} />
    </button>
  );
}