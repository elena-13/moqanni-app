'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_THEME,
  THEME_CHANGE_EVENT,
  THEME_MODES,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from '@/data/config/theme';

const THEME_ICONS = { light: Sun, dark: Moon, system: Monitor };
const darkQuery = '(prefers-color-scheme: dark)';

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

function readTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_MODES.find((mode) => mode === stored) ?? DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function writeTheme(mode: ThemeMode) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {}
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function applyTheme(mode: ThemeMode) {
  const isDark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia(darkQuery).matches);
  document.documentElement.classList.toggle('dark', isDark);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);
  const nextTheme =
    THEME_MODES[(THEME_MODES.indexOf(theme) + 1) % THEME_MODES.length];
  const Icon = THEME_ICONS[theme];

  useEffect(() => {
    applyTheme(theme);
    if (theme !== 'system') return;
    const media = window.matchMedia(darkQuery);
    const onSystemChange = () => applyTheme('system');
    media.addEventListener('change', onSystemChange);
    return () => media.removeEventListener('change', onSystemChange);
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={`Theme: ${theme}. Switch to ${nextTheme}`}
      title={`Theme: ${theme}`}
      onClick={() => writeTheme(nextTheme)}
    >
      <Icon />
    </Button>
  );
}
