import { localRouteMap } from '../config/routes.js';

export function initTransitions() {
    const resetTransitionState = () => {
        document.body.classList.remove('page-transitioning');
        document.body.style.opacity = '1';
        document.body.style.transform = 'none';
    };

    document.querySelectorAll('a[href]').forEach(link => {
        if (link.origin !== location.origin) return;

        link.addEventListener('click', e => {
            const url = new URL(link.href);
            if (url.pathname === location.pathname && url.hash) {
                return;
            }
            e.preventDefault();
            document.body.classList.add('page-transitioning');
            setTimeout(() => location.href = getNavigationHref(link), 300);
        });
    });

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            resetTransitionState();
        } else {
            resetTransitionState();
        }
    });

    window.addEventListener('load', resetTransitionState);
}

function getNavigationHref(link) {
    const url = new URL(link.href);
    if (!isLocalStaticServer()) {
        return url.href;
    }

    const path = url.pathname.replace(/\/$/, '') || '/';

    if (localRouteMap[path]) {
        url.pathname = localRouteMap[path];
    }

    return url.href;
}

function isLocalStaticServer() {
    return ['127.0.0.1', 'localhost'].includes(window.location.hostname);
}
