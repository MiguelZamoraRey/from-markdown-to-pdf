export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'markdown-a-pdf:theme';

export function resolveTheme(stored: string | null): Theme {
  return stored === 'light' ? 'light' : 'dark';
}

export function nextTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark';
}
