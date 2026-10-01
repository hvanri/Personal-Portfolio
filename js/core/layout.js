import { ROUTES } from '../config/routes.js';

/** '/about.html' -> '/about', so active state also works off a local static server. */
const fileToPath = ROUTES.reduce((map, route) => {
    map[route.file] = route.path;
    return map;
}, {});

/** Fills the page's [data-site-header] / [data-site-footer] placeholders with the shared chrome. */
export function injectLayout(headerHTML, footerHTML) {
    document.querySelectorAll('[data-site-header]').forEach(slot => { slot.innerHTML = headerHTML; });
    document.querySelectorAll('[data-site-footer]').forEach(slot => { slot.innerHTML = footerHTML; });
    setActiveNav();
}

function normalizePath(pathname) {
    return fileToPath[pathname] || pathname.replace(/\/$/, '') || '/';
}

function setActiveNav() {
    const currentPath = normalizePath(window.location.pathname);

    document.querySelectorAll('.primary-nav a, .footer-nav a').forEach(link => {
        const linkUrl = new URL(link.getAttribute('href'), window.location.origin);
        if (linkUrl.origin !== window.location.origin) return;
        if (linkUrl.hash) return;

        if (normalizePath(linkUrl.pathname) === currentPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}
