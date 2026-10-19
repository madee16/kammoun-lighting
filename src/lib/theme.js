export const THEME_KEY = 'kammoun-lighting-theme';

export function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    // User requested lighter theme (white/skyish): reset any legacy dark preference
    if (stored === 'dark') {
      localStorage.setItem(THEME_KEY, 'light');
      return 'light';
    }
    return stored === 'light' ? stored : 'light';
  } catch {
    return 'light';
  }
}

export function themeFromSystem() {
  return 'light';
}

export function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function applyTheme(theme) {
  const value = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', value);
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch {
    // ignore storage write failures (e.g. private browsing)
  }
}