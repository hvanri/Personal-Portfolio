import { primaryNavItems, footerNavItems } from '../config/routes.js';

function renderNavLink(item) {
    const href = item.path || item.href;
    const external = Boolean(item.href);
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a${attrs} href="${href}" data-page="${item.id}" data-i18n="${item.i18nKey}">${item.label}</a>`;
}

function renderNav(items, indent) {
    return items.map(item => `${indent}${renderNavLink(item)}`).join('\n');
}

export const headerHTML = `
    <header class="site-header">
        <a class="logo" href="/" aria-label="Hà Văn Ri — home">
            <span class="logo-mark" aria-hidden="true">HVR</span>
            <span class="logo-text" data-i18n="header.logo">Hà Văn Ri</span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">
            <span aria-hidden="true">Menu</span>
            <span class="sr-only">Open navigation</span>
        </button>
        <nav id="primary-navigation" class="primary-nav" aria-label="Primary navigation">
${renderNav(primaryNavItems, '            ')}
        </nav>
        <div class="header-tools" aria-label="Display settings">
            <button class="lang-toggle" type="button" onclick="toggleLanguage()">EN</button>
            <button class="icon-btn theme-toggle" type="button" aria-label="Toggle color theme" onclick="toggleDarkMode()">◐</button>
        </div>
    </header>
`;

export const footerHTML = `
    <footer class="site-footer">
        <p class="footer-statement">Open to thoughtful engineering conversations.</p>
        <nav class="footer-nav" aria-label="Footer navigation">
${renderNav(footerNavItems, '            ')}
        </nav>
        <div class="footer-meta">
            <a href="mailto:havanri.1707@gmail.com">havanri.1707@gmail.com</a>
            <span>Hanoi, Vietnam</span>
            <span>© 2026 Hà Văn Ri</span>
        </div>
    </footer>
`;
