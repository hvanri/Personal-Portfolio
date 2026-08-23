import { injectLayout } from './core/layout.js';
import { initDarkMode, toggleDarkMode } from './features/dark-mode.js';
import { initI18n, toggleLanguage } from './features/i18n.js';
import { initTransitions } from './core/router.js';
import { initRecentPosts } from './features/posts.js';
import { initWorkChapters } from './features/chapters.js';
import { initSignature } from './features/signature.js';
import { initBlogPage } from './blog.js';
import { initGtm } from './core/gtm.js';
import { initAnalytics, trackEvent, trackPageView } from './analytics/analytics.js';
import { EVENTS } from './analytics/events.js';
import { headerHTML, footerHTML } from './partials/layout.js';

window.toggleDarkMode = toggleDarkMode;
window.toggleLanguage = toggleLanguage;

injectLayout(headerHTML, footerHTML);
initDarkMode();
initI18n();
initRecentPosts();
initWorkChapters();
initSignature();
initBlogPage();
initTransitions();
initGtm();
initAnalytics();

window.addEventListener('load', () => {
    trackPageView(window.location.pathname, document.title);
});

window.addEventListener('click', (event) => {
    const target = event.target.closest('a, button');
    if (!target) {
        return;
    }

    const menuLink = target.closest('nav a');
    if (menuLink) {
        trackEvent(EVENTS.MENU_CLICK, { menu_item: menuLink.dataset.page || menuLink.textContent.trim() });
    }

    if (target.closest('.social-links a[href^="https://github.com"]')) {
        trackEvent(EVENTS.GITHUB_CLICK, { location: 'hero' });
    }

    if (target.closest('.social-links a[href*="linkedin.com"]')) {
        trackEvent(EVENTS.LINKEDIN_CLICK, { location: 'hero' });
    }

    if (target.closest('.social-links a[href^="mailto:"]')) {
        trackEvent(EVENTS.EMAIL_CLICK, { location: 'hero' });
    }

    if (target.closest('a[target="_blank"], a[rel*="noopener"]')) {
        const href = target.getAttribute('href');
        if (href && !href.startsWith(window.location.origin)) {
            trackEvent(EVENTS.EXTERNAL_LINK_CLICK, { href });
        }
    }
});
