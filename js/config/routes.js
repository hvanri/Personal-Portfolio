/**
 * Single source of truth for the site's information architecture.
 *
 * Consumed by:
 *   - js/partials/layout.js        header nav + footer nav markup
 *   - js/core/router.js            pretty path -> .html file mapping on local static servers
 *   - scripts/generate-sitemap.mjs sitemap.xml + robots.txt
 *
 * Adding a page means adding one entry to ROUTES. Nothing else needs editing.
 *
 * Field notes:
 *   path      the canonical, extensionless URL. Netlify 301s /x.html -> /x, so
 *             this is the only form that should ever be linked or indexed.
 *   file      the real file on disk, used for local dev and for sitemap lastmod.
 *   i18nKey   key in js/translations.js. Header and footer share keys on purpose.
 *   sitemap   omit entirely to keep a route out of sitemap.xml.
 */

export const SITE = {
    origin: 'https://buildwithri.netlify.app',
    name: 'Hà Văn Ri',
};

export const ROUTES = [
    {
        id: 'home',
        path: '/',
        file: '/index.html',
        i18nKey: 'header.home',
        label: 'Trang chủ',
        inPrimaryNav: true,
        inFooterNav: true,
        sitemap: { changefreq: 'monthly', priority: '1.0' },
    },
    {
        id: 'about',
        path: '/about',
        file: '/about.html',
        i18nKey: 'header.about',
        label: 'Giới thiệu',
        inPrimaryNav: true,
        inFooterNav: true,
        sitemap: { changefreq: 'monthly', priority: '0.8' },
    },
    {
        id: 'blog',
        path: '/blog',
        file: '/blog.html',
        i18nKey: 'header.blog',
        label: 'Blog',
        inPrimaryNav: true,
        inFooterNav: true,
        sitemap: { changefreq: 'weekly', priority: '0.7' },
    },
    {
        id: 'projects',
        path: '/projects',
        file: '/projects.html',
        i18nKey: 'header.projects',
        label: 'Dự án',
        inPrimaryNav: true,
        inFooterNav: true,
        sitemap: { changefreq: 'monthly', priority: '0.9' },
    },
];

/**
 * Off-site destinations that still appear in navigation. Never indexed, never
 * placed in sitemap.xml — a sitemap may only contain URLs on its own origin.
 *
 * TODO(havanri): youtube points at the YouTube homepage, not a channel. Replace
 * with the real channel URL or drop the entry.
 */
export const EXTERNAL_NAV = [
    {
        id: 'youtube',
        href: 'https://www.youtube.com/',
        i18nKey: 'header.youtube',
        label: 'Youtube',
        inPrimaryNav: true,
        inFooterNav: false,
    },
];

/** Dev artefacts that are publicly reachable but must stay out of search results. */
export const DISALLOWED_PATHS = [
    '/hm-anim.html',
    '/index.html_back',
];

export const primaryNavItems = [...ROUTES, ...EXTERNAL_NAV].filter(item => item.inPrimaryNav);

export const footerNavItems = [...ROUTES, ...EXTERNAL_NAV].filter(item => item.inFooterNav);

export const indexableRoutes = ROUTES.filter(route => route.sitemap);

/** { '/about': '/about.html', ... } — only needed when opening files off disk. */
export const localRouteMap = ROUTES.reduce((map, route) => {
    map[route.path] = route.file;
    return map;
}, {});

/** Absolute URL for a canonical path. canonicalUrl('/') -> 'https://…/' */
export function canonicalUrl(path) {
    return path === '/' ? `${SITE.origin}/` : `${SITE.origin}${path}`;
}
