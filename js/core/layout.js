export function injectLayout(headerHTML, footerHTML, currentPage) {
    const container = document.querySelector('.container');
    container.insertAdjacentHTML('afterbegin', headerHTML);
    container.insertAdjacentHTML('beforeend', footerHTML);
    setActiveNav(currentPage);
}

function setActiveNav(page) {
    document.querySelectorAll('nav a').forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
}
