import { trackEvent } from '../analytics/analytics.js';
import { EVENTS } from '../analytics/events.js';

export function initDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', isDark);
}

export function toggleDarkMode() {
    const enabled = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', enabled);
    trackEvent(EVENTS.THEME_CHANGE, { theme: enabled ? 'dark' : 'light' });
}
