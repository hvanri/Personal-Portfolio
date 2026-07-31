export function injectLayout(headerHTML, footerHTML) {
    const container = document.querySelector('.container');
    container.insertAdjacentHTML('afterbegin', headerHTML);
    container.insertAdjacentHTML('beforeend', footerHTML);
    setActiveNav();
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
