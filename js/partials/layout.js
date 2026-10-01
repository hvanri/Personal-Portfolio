import { siteNavItems, CONTACT } from '../config/routes.js';

/*
 * Shared site chrome for every page. Pages provide empty placeholders —
 * <header class="ed-header" data-site-header> and <footer class="ed-footer" data-site-footer> —
 * and js/core/layout.js fills them, then marks the current route with aria-current="page".
 * Styles live in css/layout/editorial.css.
 */

const arrowIcon = '<svg class="ed-arrow" viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M1 17 17 1M4.5 1H17v12.5"/></svg>';

const monogram = '<span class="ed-monogram" aria-hidden="true">hr<span class="ed-monogram-dot"></span></span>';

const navLinks = siteNavItems
    .map(item => `<a href="${item.path}" data-page="${item.id}" data-label="${item.navLabel}">${item.navLabel}</a>`)
    .join('');

export const headerHTML = `
    <a class="ed-brand" href="/" aria-label="Hà Văn Ri — home">
        ${monogram}
        <span class="ed-brand-name" aria-hidden="true">Hà Văn Ri</span>
    </a>
    <nav class="primary-nav ed-nav" aria-label="Primary navigation">${navLinks}</nav>
    <a class="ed-talk" href="mailto:${CONTACT.email}">Let’s talk ${arrowIcon}</a>
`;

export const footerHTML = `
    <a class="ed-footer-brand" href="/" aria-label="Hà Văn Ri — home">${monogram}</a>
    <span class="ed-footer-name">Hà Văn Ri</span>
    <nav class="ed-footer-links" aria-label="Profiles">
        <a href="${CONTACT.github}" target="_blank" rel="noopener noreferrer">GitHub ${arrowIcon}</a>
        <a href="${CONTACT.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ${arrowIcon}</a>
    </nav>
`;
