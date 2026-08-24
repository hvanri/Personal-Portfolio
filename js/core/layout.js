import { ROUTES } from '../config/routes.js';

/** '/about.html' -> '/about', so active state also works off a local static server. */
const fileToPath = ROUTES.reduce((map, route) => {
    map[route.file] = route.path;
    return map;
}, {});

export function injectLayout(headerHTML, footerHTML) {
    const container = document.querySelector('.container');
    container.insertAdjacentHTML('afterbegin', headerHTML);
    container.insertAdjacentHTML('beforeend', footerHTML);
    setActiveNav();
    initNavigation();
}

function normalizePath(pathname) {
    return fileToPath[pathname] || pathname.replace(/\/$/, '') || '/';
}

function setActiveNav() {
    const currentPath = normalizePath(window.location.pathname);

    document.querySelectorAll('.primary-nav a, .footer-nav a').forEach(link => {
        const linkUrl = new URL(link.getAttribute('href'), window.location.origin);
        if (linkUrl.origin !== window.location.origin) return;

        if (normalizePath(linkUrl.pathname) === currentPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

function initNavigation() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.primary-nav');
    if (!toggle || !nav) return;

    const closeNavigation = () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeNavigation();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeNavigation();
    });
}
