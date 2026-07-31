export function initTransitions() {
    document.querySelectorAll('a[href]').forEach(link => {
        if (link.origin !== location.origin) return;

        link.addEventListener('click', e => {
            e.preventDefault();
            document.body.classList.add('page-transitioning');
            setTimeout(() => location.href = getNavigationHref(link), 300);
        });
    });
}

function getNavigationHref(link) {
    const url = new URL(link.href);
    if (!isLocalStaticServer()) {
        return url.href;
    }

    const localRoutes = {
        '/': '/index.html',
        '/about': '/about.html',
        '/blog': '/blog.html',
        '/projects': '/projects.html'
    };
    const path = url.pathname.replace(/\/$/, '') || '/';

    if (localRoutes[path]) {
        url.pathname = localRoutes[path];
    }

    return url.href;
}

function isLocalStaticServer() {
    return ['127.0.0.1', 'localhost'].includes(window.location.hostname);
}
