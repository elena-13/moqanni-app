export type ThemeMode = 'light' | 'dark' | 'system';

export const THEME_MODES: ThemeMode[] = ['light', 'dark', 'system'];
export const DEFAULT_THEME: ThemeMode = 'dark';
export const THEME_STORAGE_KEY = 'moqanni-theme';
export const THEME_CHANGE_EVENT = 'moqanni-theme-change';

// Runs before first paint so the stored theme is applied without a flash.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}')||'${DEFAULT_THEME}';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;
