import { injectLayout } from './core/layout.js';
import { initDarkMode, toggleDarkMode } from './features/dark-mode.js';
import { initI18n, toggleLanguage } from './features/i18n.js';
import { initTransitions } from './core/router.js';
import { initRecentPosts } from './features/posts.js';
import { initBlogPage } from './blog.js';
import { headerHTML, footerHTML } from './partials/layout.js';

window.toggleDarkMode = toggleDarkMode;
window.toggleLanguage = toggleLanguage;

injectLayout(headerHTML, footerHTML);
initDarkMode();
initI18n();
initRecentPosts();
initBlogPage();
initTransitions();
