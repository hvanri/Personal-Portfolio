export function injectLayout(headerHTML, footerHTML) {
    const container = document.querySelector('.container');
    container.insertAdjacentHTML('afterbegin', headerHTML);
    container.insertAdjacentHTML('beforeend', footerHTML);
    setActiveNav();
}

function setActiveNav() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html';

    document.querySelectorAll('nav a').forEach(link => {
        const linkHref = link.getAttribute('href');

        if (linkHref === currentFile) {
            link.classList.add('active');
        }
    });
}