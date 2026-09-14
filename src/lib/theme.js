export const THEME_KEY = 'kammoun-lighting-theme';

export function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

export function themeFromSystem() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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