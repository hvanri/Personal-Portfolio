export function injectLayout(headerHTML, footerHTML) {
    const container = document.querySelector('.container');
    container.insertAdjacentHTML('afterbegin', headerHTML);
    container.insertAdjacentHTML('beforeend', footerHTML);
    setActiveNav();
    initNavigation();
}

function setActiveNav() {
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

    document.querySelectorAll('nav a').forEach(link => {
        const linkUrl = new URL(link.getAttribute('href'), window.location.origin);
        if (linkUrl.origin !== window.location.origin) return;

        const linkHref = linkUrl.pathname.replace(/\/$/, '') || '/';

        if (linkHref === currentPath) {
            link.classList.add('active');
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
